from __future__ import annotations

import argparse
import os
from pathlib import Path

from fastapi import FastAPI

from aion.audit import audit_website, write_audit
from aion.models import (
    ActionProposal,
    ExperimentMetrics,
    WebsiteAuditInput,
)
from aion.policy import evaluate_experiment, preflight_action

app = FastAPI(title="AION Revenue Engine", version="0.3.0")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "mode": "zero-budget-approval-gated"}


@app.post("/actions/preflight")
def action_preflight(action: ActionProposal):
    return preflight_action(action)


@app.post("/experiments/evaluate")
def experiment_evaluation(metrics: ExperimentMetrics):
    return evaluate_experiment(metrics)


@app.post("/audits/from-text")
def audit_from_text(data: WebsiteAuditInput):
    return audit_website(data)


def cli() -> None:
    parser = argparse.ArgumentParser(description="AION Revenue Engine")
    parser.add_argument("--audit-file")
    parser.add_argument("--business-name", default="Beispielunternehmen")
    parser.add_argument("--primary-offer", default="Gebäudeservice")
    parser.add_argument("--desired-customer", default="Hausverwaltungen und Eigentümer")
    parser.add_argument("--desired-action", default="Unverbindlich anfragen")
    parser.add_argument("--output", default="generated/audit-report.html")
    args = parser.parse_args()

    if not args.audit_file:
        parser.print_help()
        return
    text = Path(args.audit_file).read_text(encoding="utf-8")
    report = audit_website(WebsiteAuditInput(
        business_name=args.business_name,
        website_text=text,
        primary_offer=args.primary_offer,
        desired_customer=args.desired_customer,
        desired_action=args.desired_action,
    ))
    print(write_audit(report, args.output))


if __name__ == "__main__":
    port = os.environ.get("PORT")
    if port:
        import uvicorn
        uvicorn.run("main:app", host="0.0.0.0", port=int(port))
    else:
        cli()
