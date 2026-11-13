-- Delete all Lestora orders EXCEPT ONE  (Postgres / Neon SQL Editor)
-- ---------------------------------------------------------------------
-- "Lestora order" = an order whose customer's email, name OR the order's
-- special notes contain "lestora". Change the pattern in STEP 0 if your
-- test orders are identified differently (e.g. '%lestora.com%').
--
-- The order that is KEPT is the newest Lestora order by default.
-- To keep a specific one instead, set keep_order_number in STEP 0.
--
-- Run STEP 1 first (preview). Then run STEP 2 (the delete) as one block.
-- ---------------------------------------------------------------------

-- STEP 1: PREVIEW (read-only) ------------------------------------------
SELECT o."orderNumber", o."createdAt", u.email, o.status, o."paymentStatus", o."totalAmount",
       CASE WHEN o.id = (SELECT o2.id FROM orders o2 JOIN users u2 ON u2.id = o2."customerId"
                         WHERE u2.email ILIKE '%lestora%' OR u2.name ILIKE '%lestora%' OR o2."specialNotes" ILIKE '%lestora%'
                         ORDER BY o2."createdAt" DESC LIMIT 1)
            THEN 'KEEP' ELSE 'DELETE' END AS action
FROM orders o
JOIN users u ON u.id = o."customerId"
WHERE u.email ILIKE '%lestora%' OR u.name ILIKE '%lestora%' OR o."specialNotes" ILIKE '%lestora%'
ORDER BY o."createdAt" DESC;

-- STEP 2: DELETE (run this whole block together) ------------------------
BEGIN;

CREATE TEMP TABLE _keep ON COMMIT DROP AS
SELECT o.id
FROM orders o
JOIN users u ON u.id = o."customerId"
WHERE (u.email ILIKE '%lestora%' OR u.name ILIKE '%lestora%' OR o."specialNotes" ILIKE '%lestora%')
  -- AND o."orderNumber" = 'PUT-ORDER-NUMBER-HERE'   -- uncomment to keep a specific order
ORDER BY o."createdAt" DESC
LIMIT 1;

CREATE TEMP TABLE _del ON COMMIT DROP AS
SELECT o.id, o."groupId"
FROM orders o
JOIN users u ON u.id = o."customerId"
WHERE (u.email ILIKE '%lestora%' OR u.name ILIKE '%lestora%' OR o."specialNotes" ILIKE '%lestora%')
  AND o.id NOT IN (SELECT id FROM _keep);

DELETE FROM affiliate_commissions WHERE "orderId" IN (SELECT id FROM _del);
DELETE FROM invoices              WHERE "orderId" IN (SELECT id FROM _del);
DELETE FROM reviews               WHERE "orderId" IN (SELECT id FROM _del);
DELETE FROM payments              WHERE "orderId" IN (SELECT id FROM _del);

-- coupon redemptions of checkout groups that no longer have any order left
DELETE FROM coupon_redemptions cr
WHERE cr."groupId" IN (SELECT "groupId" FROM _del)
  AND NOT EXISTS (SELECT 1 FROM orders o WHERE o."groupId" = cr."groupId" AND o.id NOT IN (SELECT id FROM _del));

DELETE FROM orders WHERE id IN (SELECT id FROM _del);

-- Check before committing: should show exactly 1 Lestora order left
SELECT o."orderNumber", u.email
FROM orders o JOIN users u ON u.id = o."customerId"
WHERE u.email ILIKE '%lestora%' OR u.name ILIKE '%lestora%' OR o."specialNotes" ILIKE '%lestora%';

COMMIT;   -- if the result above is wrong, run ROLLBACK; instead
