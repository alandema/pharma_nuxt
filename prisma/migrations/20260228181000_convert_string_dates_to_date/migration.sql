ALTER TABLE "patients"
  ALTER COLUMN "birth_date" TYPE DATE
  USING CASE
    WHEN "birth_date" IS NULL OR "birth_date" = '' THEN NULL
    ELSE "birth_date"::date
  END;

ALTER TABLE "prescriptions"
  ALTER COLUMN "date_prescribed" TYPE DATE
  USING "date_prescribed"::date;
