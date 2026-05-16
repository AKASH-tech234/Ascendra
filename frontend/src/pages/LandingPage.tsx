import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CalendarCheck2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap,
  Star,
} from "lucide-react";
import { MarketingNav } from "../components/layout/MarketingNav";
import { MarketingFooter } from "../components/layout/MarketingFooter";
import { Badge } from "../components/ui/badge";
import { buttonStyles } from "../components/ui/button";
import { Card } from "../components/ui/card";

const trustLogos = ["NorthBridge", "Pinnacle", "Aster", "Orbit", "Horizon"];

const snapshotItems = [
  { label: "Pipeline conversion", value: "72%", width: 72 },
  { label: "Onboarding quality", value: "64%", width: 64 },
  { label: "Platform stability", value: "88%", width: 88 },
];

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type RoleCard = {
  title: string;
  description: string;
  bullets: string[];
  href: string;
  icon: LucideIcon;
};

const features: Feature[] = [
  {
    title: "Goal weighting with guardrails",
    description:
      "Enforce 100% weighting, align goals to themes, and lock edits after approval.",
    icon: Target,
  },
  {
    title: "Approvals that keep momentum",
    description:
      "Manager review queues, inline edits, and audit trails keep every cycle on track.",
    icon: Workflow,
  },
  {
    title: "Quarterly check-ins that stick",
    description:
      "Planned vs actual progress, status signals, and narrative updates in one flow.",
    icon: CalendarCheck2,
  },
  {
    title: "Manager coaching insights",
    description:
      "Spot teams at risk, collect feedback, and keep check-ins on schedule.",
    icon: Users,
  },
  {
    title: "Executive-ready analytics",
    description:
      "Adoption, completion, and health metrics with drill downs by org unit.",
    icon: BarChart3,
  },
  {
    title: "Enterprise-grade controls",
    description:
      "Azure AD ready, role-based access, and immutable logs built in.",
    icon: ShieldCheck,
  },
];

const roleCards: RoleCard[] = [
  {
    title: "Employee workspace",
    description:
      "Draft weighted goals, track progress, and submit quarterly updates.",
    bullets: [
      "Goal draft builder",
      "Shared goal visibility",
      "Check-in reminders",
    ],
    href: "/app/employee",
    icon: Target,
  },
  {
    title: "Manager command center",
    description: "Approve goals, coach teams, and review check-ins at scale.",
    bullets: ["Approval queue", "Team health view", "Feedback history"],
    href: "/app/manager",
    icon: Users,
  },
  {
    title: "Admin and HR oversight",
    description: "Manage cycles, policies, and organization-wide progress.",
    bullets: ["Role and policy control", "Cycle management", "Audit trail"],
    href: "/app/admin",
    icon: ShieldCheck,
  },
];

const steps = [
  {
    step: "01",
    title: "Set the cycle and themes",
    description:
      "Admin configures the quarter, goal categories, and approval policies.",
    icon: Zap,
  },
  {
    step: "02",
    title: "Draft goals with weights",
    description:
      "Employees propose goals, attach metrics, and align with company themes.",
    icon: Target,
  },
  {
    step: "03",
    title: "Managers approve and coach",
    description:
      "Review queues, request edits, and lock approved goals for the cycle.",
    icon: CheckCircle2,
  },
  {
    step: "04",
    title: "Run check-ins and retros",
    description: "Quarterly updates capture progress, risks, and next actions.",
    icon: CalendarCheck2,
  },
];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
} as const;

export function LandingPage() {
  return (
    <div className="bg-white text-ink">
      <MarketingNav />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary-100/40 blur-3xl" />
          <div className="absolute top-20 -left-20 h-[300px] w-[300px] rounded-full bg-primary-50/60 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[200px] w-[200px] rounded-full bg-warning-100/30 blur-3xl" />

          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-[1.1fr_0.9fr] relative">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-6"
            >
              <motion.div variants={fadeUp}>
                <Badge className="w-fit gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Enterprise goal intelligence
                </Badge>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="bg-gradient-to-r from-ink via-ink to-accent bg-clip-text"
              >
                Align every quarter.{" "}
                <span className="text-accent">Deliver every goal.</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="max-w-xl">
                Ascendra brings goal setting, approvals, and check-ins into a
                single platform that feels as polished as your business.
              </motion.p>
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-3"
              >
                <Link
                  to="/auth/sign-up"
                  className={buttonStyles({ size: "lg" })}
                >
                  Start the cycle
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/auth/sign-in"
                  className={buttonStyles({ variant: "secondary", size: "lg" })}
                >
                  View demo
                </Link>
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="flex flex-wrap gap-6 text-sm font-semibold text-ink-2"
              >
                {[
                  "Azure AD ready",
                  "Goal weights enforced",
                  "Audit trails included",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success-500" />
                    {item}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -top-8 right-6 h-24 w-24 rounded-3xl bg-primary-100/50 blur-2xl" />
              <Card className="relative overflow-hidden shadow-xl shadow-primary-500/5 border-primary-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-2">
                      Quarter snapshot
                    </div>
                    <div className="text-xl font-bold text-ink mt-1">
                      Q3 Momentum
                    </div>
                  </div>
                  <div className="rounded-full bg-success-50 px-3 py-1.5 text-xs font-bold text-success-700">
                    82% complete
                  </div>
                </div>
                <div className="mt-6 space-y-5">
                  {snapshotItems.map((item, i) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-ink">
                          {item.label}
                        </span>
                        <span className="font-bold text-accent">
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-primary-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${item.width}%` }}
                          transition={{
                            duration: 1,
                            delay: 0.6 + i * 0.15,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-xl bg-primary-50 p-4 text-sm text-primary-700 font-medium">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-4 w-4" />
                    Next check-in due in 6 days. Keep momentum with timely
                    updates.
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto max-w-6xl px-6 pb-16"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white px-6 py-4 text-sm text-ink-2 shadow-card">
              <div className="font-semibold text-ink flex items-center gap-2">
                <Star className="h-4 w-4 text-warning-500" />
                Trusted by teams at
              </div>
              <div className="flex flex-wrap gap-6 text-xs font-bold uppercase tracking-[0.3em] text-ink-2/70">
                {trustLogos.map((logo) => (
                  <span key={logo} className="hover:text-ink transition-colors">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="product" className="bg-surface-2/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
              className="flex flex-wrap items-end justify-between gap-4"
            >
              <motion.div variants={fadeUp} className="space-y-4">
                <Badge variant="outline" className="gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Product highlights
                </Badge>
                <h2>Everything needed to run goal cycles</h2>
                <p>
                  Built for speed today and ready for smarter automation
                  tomorrow.
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
              className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={feature.title} variants={fadeUp}>
                    <Card className="space-y-4 h-full group">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 transition-colors group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/20">
                        <Icon className="h-6 w-6 text-accent transition-colors group-hover:text-white" />
                      </div>
                      <div className="text-lg font-bold text-ink">
                        {feature.title}
                      </div>
                      <p className="text-sm text-ink-2 leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Roles */}
        <section id="roles" className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-end justify-between gap-4"
            >
              <div className="space-y-3">
                <Badge variant="outline">Role experiences</Badge>
                <h2>Tailored dashboards for every role</h2>
              </div>
              <p className="max-w-xl">
                Employees, managers, and admins each get the tools and
                visibility they need without drowning in menus.
              </p>
            </motion.div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {roleCards.map((role) => {
                const Icon = role.icon;
                return (
                  <motion.div
                    key={role.title}
                    variants={fadeUp}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="flex h-full flex-col">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 mb-4">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="space-y-3">
                        <div className="text-lg font-bold text-ink">
                          {role.title}
                        </div>
                        <p className="text-sm text-ink-2">
                          {role.description}
                        </p>
                      </div>
                      <ul className="mt-5 space-y-2.5 text-sm text-ink-2">
                        {role.bullets.map((bullet) => (
                          <li key={bullet} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success-500 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      <Link
                        to={role.href}
                        className={buttonStyles({
                          variant: "secondary",
                          size: "sm",
                          className: "mt-6 w-fit group",
                        })}
                      >
                        Preview view
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="bg-surface-2/50 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="space-y-3">
                <Badge variant="outline">How it works</Badge>
                <h2>Clear steps from planning to performance</h2>
              </motion.div>
              <div className="mt-12 grid gap-6 md:grid-cols-2">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <motion.div key={step.step} variants={fadeUp}>
                      <Card className="space-y-4 h-full">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-sm font-bold text-white">
                            {step.step}
                          </div>
                          <Icon className="h-5 w-5 text-ink-2" />
                        </div>
                        <div className="text-lg font-bold text-ink">
                          {step.title}
                        </div>
                        <p className="text-sm text-ink-2 leading-relaxed">
                          {step.description}
                        </p>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Security */}
        <section id="security" className="mx-auto max-w-6xl px-6 py-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <Badge variant="outline">Security and compliance</Badge>
              <h2>Enterprise-ready from day one</h2>
              <p>
                Built to align with Azure-first deployment, RBAC, and encrypted
                storage. Every edit and approval is recorded.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-ink-2">
                {[
                  "Azure AD roles",
                  "Audit-ready logs",
                  "TLS and at-rest encryption",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-success-500" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <Card className="space-y-4">
                <div className="text-sm font-bold text-ink">Controls pack</div>
                <div className="space-y-3 text-sm text-ink-2">
                  {[
                    { label: "Role-based access", status: "Active" },
                    { label: "Approval lock", status: "Enabled" },
                    { label: "Check-in audit", status: "Enabled" },
                    { label: "PII controls", status: "Monitored" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-2 transition-colors"
                    >
                      <span>{item.label}</span>
                      <Badge variant="success">{item.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid gap-8 rounded-3xl bg-gradient-to-br from-accent via-primary-700 to-primary-900 px-8 py-14 md:grid-cols-[1.2fr_0.8fr] overflow-hidden relative"
          >
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute bottom-0 left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
            <div className="space-y-4 relative">
              <h2 className="text-white">Run your next goal cycle in days</h2>
              <p className="text-white/70">
                Launch a polished experience for employees, managers, and HR
                with a hackathon-ready build path.
              </p>
            </div>
            <div className="flex flex-col gap-3 relative">
              <Link
                to="/auth/sign-up"
                className="inline-flex items-center justify-center rounded-full bg-white text-accent font-bold px-7 py-3 text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all gap-2"
              >
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/auth/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-white/30 text-white font-semibold px-7 py-3 text-base hover:bg-white/10 transition-all"
              >
                Book a walkthrough
              </Link>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/60 mt-1">
                <BellRing className="h-4 w-4" />
                Automated nudges keep teams on time.
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
