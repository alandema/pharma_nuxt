-- Normalize legacy non-admin roles to prescritor
UPDATE "users"
SET "role" = 'prescritor'
WHERE "role" IN ('doctor', 'user');
