import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';
import { PrismaNeon } from '@prisma/adapter-neon'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting database seed...');

  // Create users
  const adminHash = await bcrypt.hash('admin123', 10);
  const doctorHash = await bcrypt.hash('doctor123', 10);

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password_hash: adminHash,
      role: 'admin',
      is_active: true,
    },
  });
  console.log('✓ Created admin user');

  const doctor1 = await prisma.user.upsert({
    where: { username: 'doctor1' },
    update: {},
    create: {
      username: 'doctor1',
      password_hash: doctorHash,
      role: 'prescritor',
      is_active: true,
    },
  });
  console.log('✓ Created doctor1 user');

  const doctor2 = await prisma.user.upsert({
    where: { username: 'doctor2' },
    update: {},
    create: {
      username: 'doctor2',
      password_hash: doctorHash,
      role: 'prescritor',
      is_active: true,
    },
  });
  console.log('✓ Created doctor2 user');

  // Create formulas
  const formulas = [
    { name: 'Aspirin Complex', information: 'Pain relief and fever reducer' },
    { name: 'Vitamin D3', information: 'Bone health supplement' },
    { name: 'Omega-3', information: 'Heart health supplement' },
  ];

  for (const formula of formulas) {
    await prisma.formulas.upsert({
      where: { name: formula.name },
      update: {},
      create: formula,
    });
  }
  console.log('✓ Created formulas');

  // Create patients
  const patients = [
    {
      name: 'Alice Johnson',
      cpf: '123.456.789-01',
      gender: 'Female',
      birth_date: new Date('1985-03-15T00:00:00.000Z'),
      phone: '(11) 98765-4321',
      zipcode: '01310-100',
      street: 'Av. Paulista',
      district: 'Bela Vista',
      house_number: '1578',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      medical_history: 'No significant medical history',
      registered_by: doctor1.id,
    },
    {
      name: 'Bob Smith',
      cpf: '234.567.890-12',
      gender: 'Male',
      birth_date: new Date('1978-07-22T00:00:00.000Z'),
      phone: '(11) 98765-1234',
      zipcode: '04543-907',
      street: 'Av. Brigadeiro Faria Lima',
      district: 'Itaim Bibi',
      house_number: '3477',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      medical_history: 'Hypertension',
      registered_by: doctor1.id,
    },
    {
      name: 'Carol Martinez',
      cpf: '345.678.901-23',
      gender: 'Female',
      birth_date: new Date('1992-11-03T00:00:00.000Z'),
      phone: '(11) 98765-5678',
      zipcode: '05508-000',
      street: 'Av. Rebouças',
      district: 'Pinheiros',
      house_number: '3970',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      medical_history: 'Allergic to penicillin',
      registered_by: doctor1.id,
    },
    {
      name: 'David Lee',
      cpf: '456.789.012-34',
      gender: 'Male',
      birth_date: new Date('1965-05-18T00:00:00.000Z'),
      phone: '(11) 98765-9012',
      zipcode: '01452-002',
      street: 'Rua Augusta',
      district: 'Consolação',
      house_number: '2690',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      medical_history: 'Diabetes type 2',
      registered_by: doctor2.id,
    },
    {
      name: 'Emma Wilson',
      cpf: '567.890.123-45',
      gender: 'Female',
      birth_date: new Date('2000-09-25T00:00:00.000Z'),
      phone: '(11) 98765-3456',
      zipcode: '01414-001',
      street: 'Rua Haddock Lobo',
      district: 'Cerqueira César',
      house_number: '595',
      city: 'São Paulo',
      state: 'SP',
      country: 'Brazil',
      medical_history: 'No significant medical history',
      registered_by: doctor2.id,
    },
  ];

  const createdPatients = [];
  for (const patient of patients) {
    const created = await prisma.patient.create({
      data: patient,
    });
    createdPatients.push(created);
  }
  console.log('✓ Created patients');

  // Create prescriptions
  const prescriptions = [
    {
      patient_id: createdPatients[0].id,
      prescribed_by: doctor1.id,
      date_prescribed: new Date('2026-02-10T00:00:00.000Z'),
      json_form_info: JSON.stringify({
        medication: 'Aspirin Complex',
        dosage: '500mg',
        frequency: 'Every 8 hours',
        duration: '7 days',
        notes: 'Take with food'
      }),
    },
    {
      patient_id: createdPatients[1].id,
      prescribed_by: doctor1.id,
      date_prescribed: new Date('2026-02-12T00:00:00.000Z'),
      json_form_info: JSON.stringify({
        medication: 'Losartan',
        dosage: '50mg',
        frequency: 'Once daily',
        duration: 'Continuous',
        notes: 'For blood pressure control'
      }),
    },
    {
      patient_id: createdPatients[2].id,
      prescribed_by: doctor1.id,
      date_prescribed: new Date('2026-02-13T00:00:00.000Z'),
      json_form_info: JSON.stringify({
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Every 12 hours',
        duration: '10 days',
        notes: 'Patient is NOT allergic to amoxicillin, only penicillin'
      }),
    },
    {
      patient_id: createdPatients[3].id,
      prescribed_by: doctor2.id,
      date_prescribed: new Date('2026-02-14T00:00:00.000Z'),
      json_form_info: JSON.stringify({
        medication: 'Metformin',
        dosage: '850mg',
        frequency: 'Twice daily',
        duration: 'Continuous',
        notes: 'For diabetes management'
      }),
    },
    {
      patient_id: createdPatients[4].id,
      prescribed_by: doctor2.id,
      date_prescribed: new Date('2026-02-15T00:00:00.000Z'),
      json_form_info: JSON.stringify({
        medication: 'Vitamin D3',
        dosage: '2000 IU',
        frequency: 'Once daily',
        duration: '3 months',
        notes: 'Vitamin D deficiency'
      }),
    },
    {
      patient_id: createdPatients[0].id,
      prescribed_by: doctor2.id,
      date_prescribed: new Date('2026-01-15T00:00:00.000Z'),
      json_form_info: JSON.stringify({
        medication: 'Omega-3',
        dosage: '1000mg',
        frequency: 'Once daily',
        duration: 'Continuous',
        notes: 'For heart health'
      }),
    },
    {
      patient_id: createdPatients[1].id,
      prescribed_by: doctor2.id,
      date_prescribed: new Date('2026-01-20T00:00:00.000Z'),
      json_form_info: JSON.stringify({
        medication: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily at night',
        duration: 'Continuous',
        notes: 'For cholesterol management'
      }),
    },
    {
      patient_id: createdPatients[2].id,
      prescribed_by: doctor1.id,
      date_prescribed: new Date('2026-01-25T00:00:00.000Z'),
      json_form_info: JSON.stringify({
        medication: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours as needed',
        duration: '5 days',
        notes: 'For pain relief'
      }),
    },
  ];

  for (const prescription of prescriptions) {
    await prisma.prescription.create({
      data: prescription,
    });
  }
  console.log('✓ Created prescriptions');

  // Create logs (matching the actions above)
  const logs = [
    { event_time: new Date('2026-01-10T09:00:00'), message: 'Cadastrou paciente: Alice Johnson', user_id: doctor1.id, patient_id: createdPatients[0].id },
    { event_time: new Date('2026-01-10T09:15:00'), message: 'Cadastrou paciente: Bob Smith', user_id: doctor1.id, patient_id: createdPatients[1].id },
    { event_time: new Date('2026-01-10T09:30:00'), message: 'Cadastrou paciente: Carol Martinez', user_id: doctor1.id, patient_id: createdPatients[2].id },
    { event_time: new Date('2026-01-11T10:00:00'), message: 'Cadastrou paciente: David Lee', user_id: doctor2.id, patient_id: createdPatients[3].id },
    { event_time: new Date('2026-01-11T10:20:00'), message: 'Cadastrou paciente: Emma Wilson', user_id: doctor2.id, patient_id: createdPatients[4].id },
    { event_time: new Date('2026-01-12T11:00:00'), message: 'Editou paciente: Alice Johnson', user_id: doctor1.id, patient_id: createdPatients[0].id },
    { event_time: new Date('2026-01-15T14:00:00'), message: 'Prescreveu para paciente', user_id: doctor2.id, patient_id: createdPatients[0].id },
    { event_time: new Date('2026-01-20T09:00:00'), message: 'Prescreveu para paciente', user_id: doctor2.id, patient_id: createdPatients[1].id },
    { event_time: new Date('2026-01-25T10:30:00'), message: 'Prescreveu para paciente', user_id: doctor1.id, patient_id: createdPatients[2].id },
    { event_time: new Date('2026-02-10T08:00:00'), message: 'Prescreveu para paciente', user_id: doctor1.id, patient_id: createdPatients[0].id },
    { event_time: new Date('2026-02-12T09:00:00'), message: 'Prescreveu para paciente', user_id: doctor1.id, patient_id: createdPatients[1].id },
    { event_time: new Date('2026-02-13T10:00:00'), message: 'Prescreveu para paciente', user_id: doctor1.id, patient_id: createdPatients[2].id },
    { event_time: new Date('2026-02-14T11:00:00'), message: 'Prescreveu para paciente', user_id: doctor2.id, patient_id: createdPatients[3].id },
    { event_time: new Date('2026-02-15T12:00:00'), message: 'Prescreveu para paciente', user_id: doctor2.id, patient_id: createdPatients[4].id },
    { event_time: new Date('2026-02-16T14:00:00'), message: 'Editou paciente: Bob Smith', user_id: doctor1.id, patient_id: createdPatients[1].id },
  ];

  for (const log of logs) {
    await prisma.log.create({ data: log });
  }
  console.log('✓ Created logs');

  console.log('\n✅ Database seeding completed successfully!');
  console.log('\nTest credentials:');
  console.log('  Admin: username=admin, password=admin123');
  console.log('  Prescritor: username=doctor1, password=doctor123');
  console.log('  Prescritor: username=doctor2, password=doctor123');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error seeding database:', e);
  process.exit(1);
});
