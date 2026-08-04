from aion.audit import audit_website, render_audit_html
from aion.models import (
    ActionProposal,
    ActionType,
    ApprovalStatus,
    EvidenceAssessment,
    ExperimentMetrics,
    Opportunity,
    RiskAssessment,
    WebsiteAuditInput,
)
from aion.policy import decide, evaluate_experiment, preflight_action


def test_zero_budget_prototype_can_be_approved():
    result = decide(
        Opportunity(title="Audit", problem="unclear website", audience="local firms", offer="audit", free_distribution_channels=["direct outreach"], evidence=["interviews"], estimated_build_hours=4),
        EvidenceAssessment(demand_score=90, evidence_quality_score=85, monetization_score=90, automation_score=85, uncertainty_score=10),
        RiskAssessment(legal_risk=5, financial_risk=5, reputation_risk=5, execution_risk=10),
    )
    assert result.decision.value == "approve_prototype"


def test_paid_dependency_is_rejected():
    result = decide(
        Opportunity(title="Paid", problem="x", audience="y", offer="z", estimated_monthly_cost_eur=1),
        EvidenceAssessment(demand_score=100, evidence_quality_score=100, monetization_score=100, automation_score=100, uncertainty_score=0),
        RiskAssessment(legal_risk=0, financial_risk=0, reputation_risk=0, execution_risk=0),
    )
    assert result.decision.value == "reject"


def test_external_action_waits_for_approval():
    record = preflight_action(ActionProposal(title="Publish", action_type=ActionType.PUBLISH, description="Publish landing page", touches_external_system=True))
    assert record.status == ApprovalStatus.PENDING


def test_local_draft_is_automatic():
    record = preflight_action(ActionProposal(title="Draft", action_type=ActionType.CREATE_LOCAL_ASSET, description="Create local draft"))
    assert record.status == ApprovalStatus.NOT_REQUIRED


def test_profit_validates_experiment():
    result = evaluate_experiment(ExperimentMetrics(leads_contacted=10, replies=3, sales=1, revenue_eur=29))
    assert result.verdict == "validated"
    assert result.profit_eur == 29


def test_audit_creates_customer_report():
    report = audit_website(WebsiteAuditInput(business_name="Test", website_text="Willkommen bei uns.", primary_offer="Gebäudeservice", desired_customer="Eigentümer"))
    assert report.overall_score < 70
    assert "<!doctype html>" in render_audit_html(report)
