CREATE TABLE "cart_items" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"design_id" text NOT NULL,
	"garment" text NOT NULL,
	"color" text NOT NULL,
	"measurements" jsonb NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "designs" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"prompt" text NOT NULL,
	"image_url" text NOT NULL,
	"garment" text NOT NULL,
	"color" text NOT NULL,
	"placement" jsonb NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"markup_cents" integer DEFAULT 0 NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "earnings" (
	"id" text PRIMARY KEY NOT NULL,
	"designer_id" text NOT NULL,
	"order_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" text DEFAULT 'simulated' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generations" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"prompt" text NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"image_urls" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"buyer_id" text,
	"design_id" text NOT NULL,
	"stripe_session_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"status" text DEFAULT 'paid' NOT NULL,
	"measurements" jsonb NOT NULL,
	"shipping_address" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_events" (
	"id" text PRIMARY KEY NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"stripe_account_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "earnings" ADD CONSTRAINT "earnings_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cart_items_cart_id_idx" ON "cart_items" USING btree ("cart_id");--> statement-breakpoint
CREATE INDEX "carts_user_id_idx" ON "carts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "designs_slug_idx" ON "designs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "designs_owner_id_idx" ON "designs" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "designs_status_idx" ON "designs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "designs_garment_idx" ON "designs" USING btree ("garment");--> statement-breakpoint
CREATE INDEX "earnings_designer_id_idx" ON "earnings" USING btree ("designer_id");--> statement-breakpoint
CREATE INDEX "earnings_order_id_idx" ON "earnings" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "generations_user_id_idx" ON "generations" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_stripe_session_idx" ON "orders" USING btree ("stripe_session_id");--> statement-breakpoint
CREATE INDEX "orders_buyer_id_idx" ON "orders" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "orders_design_id_idx" ON "orders" USING btree ("design_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");