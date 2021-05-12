-- AlterTable
ALTER TABLE "accessions" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "accessions_lists" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "bases" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "lists" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "names" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "specimens" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "specimens_lists" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "taxa" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "taxa_lists" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "taxa_names" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "taxon_determinations" ALTER COLUMN "created_at" SET DEFAULT now();

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "reset_password_token" TEXT,
ALTER COLUMN "created_at" SET DEFAULT now();
