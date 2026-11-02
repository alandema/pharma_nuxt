-- CreateIndex
CREATE INDEX "prescriptions_date_prescribed_created_at_idx"
ON "prescriptions"("date_prescribed" DESC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "prescriptions_prescribed_by_date_prescribed_created_at_idx"
ON "prescriptions"("prescribed_by", "date_prescribed" DESC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "prescriptions_patient_id_date_prescribed_created_at_idx"
ON "prescriptions"("patient_id", "date_prescribed" DESC, "created_at" DESC);

-- CreateIndex
CREATE INDEX "logs_event_time_idx"
ON "logs"("event_time" DESC);

-- CreateIndex
CREATE INDEX "logs_user_id_event_time_idx"
ON "logs"("user_id", "event_time" DESC);

-- CreateIndex
CREATE INDEX "logs_patient_id_event_time_idx"
ON "logs"("patient_id", "event_time" DESC);

-- CreateIndex
CREATE INDEX "patients_name_idx"
ON "patients"("name");

-- CreateIndex
CREATE INDEX "patients_registered_by_name_idx"
ON "patients"("registered_by", "name");
