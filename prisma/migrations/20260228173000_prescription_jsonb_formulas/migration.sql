-- Alter prescriptions json payload from TEXT to JSONB for structured formula prescriptions
ALTER TABLE "prescriptions"
  ALTER COLUMN "json_form_info" TYPE JSONB
  USING "json_form_info"::jsonb;
