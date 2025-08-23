const { Pool } = require('pg');

let pool = null;

function getPool() {
  if (pool) return pool;
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  return pool;
}

async function query(text, params) {
  const p = getPool();
  if (!p) throw new Error('No DATABASE_URL configured');
  const res = await p.query(text, params);
  return res;
}

async function init() {
  const p = getPool();
  if (!p) return false;
  await p.query(`create table if not exists users(
    id uuid primary key,
    name text,
    email text unique,
    role text,
    password_hash text,
    created_at timestamptz default now()
  )`);
  await p.query(`create table if not exists sessions(
    id uuid primary key,
    user_email text,
    ip text,
    created_at timestamptz default now()
  )`);
  await p.query(`create table if not exists feedback(
    id uuid primary key,
    email text,
    category text,
    message text,
    status text,
    created_at timestamptz default now()
  )`);
  await p.query(`create table if not exists events(
    id uuid primary key,
    event text,
    meta jsonb,
    t bigint
  )`);
  await p.query(`create table if not exists invoices(
    id uuid primary key,
    amount numeric,
    status text,
    created_at timestamptz default now()
  )`);
  await p.query(`create table if not exists software(
    id text primary key,
    name text,
    category text,
    description text,
    standard_price numeric,
    premium_price numeric
  )`);
  // seed software if empty
  const count = Number((await p.query('select count(*) from software')).rows[0].count);
  if (count === 0) {
    const rows = [
      ['crm-pro','Maijjd CRM Pro','Business','Customer relationship management.',59,199],
      ['analytics-suite','Maijjd Analytics Suite','Analytics','Analytics & dashboards.',79,399],
      ['security-shield','Maijjd Security Shield','Security','Security & compliance.',299,599],
      ['cloud-manager','Maijjd Cloud Manager','Cloud','Cloud resources manager.',119,349],
      ['dev-studio','Maijjd Development Studio','Development','Dev tools & pipelines.',59,249],
      ['web-builder','Maijjd Web Builder Pro','Web','Web site builder.',49,179],
      ['infra-manager','Maijjd Infrastructure Manager','Infrastructure','Infra orchestration.',199,429],
      ['marketing-auto','Maijjd Marketing Automation','Marketing & Automation','Automation campaigns.',49,159],
      ['pm-pro','Maijjd Project Management Pro','Project Management','Project planning.',25,89],
      ['ds-studio','Maijjd Data Science Studio','Data Science & ML','ML & data platform.',199,599],
      ['cs-ai','Maijjd Customer Support AI','Customer Support','AI helpdesk.',35,129],
      ['fin-analytics','Maijjd Financial Analytics','Financial Technology','FinAnalytics.',119,349],
      ['health-analytics','Maijjd Healthcare Analytics','Healthcare Technology','Health analytics.',199,499],
      ['edu-platform','Maijjd Education Platform','Education Technology','Education platform.',25,79],
    ];
    for (const r of rows) {
      await p.query('insert into software(id,name,category,description,standard_price,premium_price) values($1,$2,$3,$4,$5,$6)', r);
    }
  }
  return true;
}

module.exports = { getPool, query, init };


