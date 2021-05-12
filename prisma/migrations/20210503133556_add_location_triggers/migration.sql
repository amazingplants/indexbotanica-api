CREATE OR REPLACE FUNCTION "app"."tree_locations_ai"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
DECLARE
BEGIN
    INSERT INTO "app"."locations_tree" (parent_id, child_id, depth, base_id) VALUES (NEW.id, NEW.id, 0, NEW.base_id);
    INSERT INTO "app"."locations_tree" (parent_id, child_id, depth, base_id) SELECT x.parent_id, NEW.id, x.depth + 1, base_id FROM "app"."locations_tree" x WHERE x.child_id = NEW.parent_id;
    RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;


CREATE TRIGGER tree_locations_ai AFTER INSERT ON locations FOR EACH ROW EXECUTE PROCEDURE tree_locations_ai();



  CREATE OR REPLACE FUNCTION "app"."tree_locations_au"()
  RETURNS "pg_catalog"."trigger" AS $BODY$
DECLARE
BEGIN
    IF NOT OLD.parent_id IS DISTINCT FROM NEW.parent_id THEN
        RETURN NEW;
    END IF;
    IF OLD.parent_id IS NOT NULL THEN
        DELETE FROM "app"."locations_tree" WHERE id IN (
            SELECT r2.id FROM "app"."locations_tree" r1 JOIN "app"."locations_tree" r2 ON r1.child_id = r2.child_id
            WHERE r1.parent_id = NEW.id AND r2.depth > r1.depth
        );
    END IF;
    IF NEW.parent_id IS NOT NULL THEN
        INSERT INTO "app"."locations_tree" (parent_id, child_id, depth, base_id)
            SELECT r1.parent_id, r2.child_id, r1.depth + r2.depth + 1, r1.base_id
        FROM
            "app"."locations_tree" r1,
            "app"."locations_tree" r2
        WHERE
            r1.child_id = NEW.parent_id AND
            r2.parent_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;


  CREATE TRIGGER tree_locations_au AFTER UPDATE ON locations FOR EACH ROW EXECUTE PROCEDURE tree_locations_au();

