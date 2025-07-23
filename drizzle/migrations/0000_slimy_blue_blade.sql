CREATE TABLE "alerts" (
	"id" serial PRIMARY KEY NOT NULL,
	"transformer_id" integer,
	"type" text NOT NULL,
	"severity" text NOT NULL,
	"message" text NOT NULL,
	"is_resolved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "transformers" (
	"id" serial PRIMARY KEY NOT NULL,
	"object_id" integer,
	"global_id" text,
	"transformer_id" text,
	"latitude" real,
	"longitude" real,
	"location" text,
	"address" text,
	"type" text,
	"capacity" text,
	"manufacturer" text,
	"physical_condition" text,
	"oil_leakage" boolean,
	"rust_corrosion" boolean,
	"external_damage" boolean,
	"overheating_signs" boolean,
	"bushings_condition" text,
	"insulators_condition" text,
	"cooling_fins_present" boolean,
	"cooling_fins_state" text,
	"support_structure_type" text,
	"support_structure_condition" text,
	"safety_signage_present" boolean,
	"clearance_from_buildings" text,
	"accessibility_issues" boolean,
	"unauthorized_connections" boolean,
	"creation_date" timestamp,
	"last_update_date" timestamp,
	"assessment_date" timestamp,
	CONSTRAINT "transformers_object_id_unique" UNIQUE("object_id")
);
--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_transformer_id_transformers_id_fk" FOREIGN KEY ("transformer_id") REFERENCES "public"."transformers"("id") ON DELETE no action ON UPDATE no action;