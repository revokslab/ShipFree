-- Minimal DDL mirroring the tables the webhook writes to (with this change applied).
CREATE TABLE subscription(id text PRIMARY KEY,provider_subscription_id text NOT NULL,status text NOT NULL);
CREATE INDEX subscription_provider_subscriptionid_idx ON subscription(provider_subscription_id);
CREATE UNIQUE INDEX subscription_provider_subscriptionid_uniq ON subscription(provider_subscription_id);
