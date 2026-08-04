from __future__ import annotations

from .models import (
    ActionProposal,
    ActionType,
    ApprovalRecord,
    ApprovalStatus,
    BusinessDecision,
    Decision,
    EvidenceAssessment,
    ExperimentMetrics,
    ExperimentResult,
    Opportunity,
    RiskAssessment,
)

EXTERNAL_ACTIONS = {
    ActionType.PUBLISH,
    ActionType.SEND_MESSAGE,
    ActionType.CONFIGURE_PAYMENT,
    ActionType.SPEND_MONEY,
    ActionType.ACCOUNT_CHANGE,
    ActionType.PROCESS_PERSONAL_DATA,
    ActionType.LEGAL_COMMITMENT,
    ActionType.DELETE_OR_OVERWRITE,
}


def revenue_score(evidence: EvidenceAssessment, risk: RiskAssessment, hours: float) -> float:
    upside = (
        evidence.demand_score * 0.30
        + evidence.evidence_quality_score * 0.25
        + evidence.monetization_score * 0.25
        + evidence.automation_score * 0.20
    )
    risk_penalty = (
        risk.legal_risk * 0.30
        + risk.financial_risk * 0.25
        + risk.reputation_risk * 0.25
        + risk.execution_risk * 0.20
    ) * 0.45
    uncertainty_penalty = evidence.uncertainty_score * 0.25
    effort_penalty = min(max(hours, 0), 24) * 0.6
    return round(max(0, min(100, upside - risk_penalty - uncertainty_penalty - effort_penalty)), 1)


def decide(opportunity: Opportunity, evidence: EvidenceAssessment, risk: RiskAssessment) -> BusinessDecision:
    score = revenue_score(evidence, risk, opportunity.estimated_build_hours)
    reasons: list[str] = []

    if opportunity.estimated_monthly_cost_eur > 0:
        decision = Decision.REJECT
        reasons.append("Verletzt die Null-Budget-Regel.")
    elif risk.blockers or max(risk.legal_risk, risk.financial_risk, risk.reputation_risk) >= 70:
        decision = Decision.REJECT
        reasons.append("Unkontrolliertes oder nicht akzeptables Risiko.")
    elif opportunity.requires_external_account_action or risk.requires_human_approval:
        decision = Decision.REQUIRE_HUMAN
        reasons.append("Externe oder kritische Aktion benötigt menschliche Freigabe.")
    elif evidence.evidence_quality_score < 45 or evidence.uncertainty_score > 65:
        decision = Decision.RESEARCH
        reasons.append("Beleglage ist für einen Produktbau noch zu schwach.")
    elif score >= 60 and opportunity.estimated_build_hours <= 12:
        decision = Decision.APPROVE_PROTOTYPE
        reasons.append("Null-Budget-Prototyp mit begrenztem Aufwand und ausreichendem Revenue Score.")
    else:
        decision = Decision.RESEARCH
        reasons.append("Chance ist noch nicht stark genug für den Produktbau.")

    return BusinessDecision(
        opportunity=opportunity,
        evidence=evidence,
        risk=risk,
        revenue_score=score,
        decision=decision,
        reasons=reasons,
    )


def preflight_action(action: ActionProposal) -> ApprovalRecord:
    reasons: list[str] = []
    required = False
    if action.cost_eur > 0:
        required = True
        reasons.append("Die Aktion verursacht Kosten.")
    if action.action_type in EXTERNAL_ACTIONS or action.touches_external_system:
        required = True
        reasons.append("Die Aktion erzeugt Außenwirkung oder verändert ein externes System.")
    if action.handles_personal_data:
        required = True
        reasons.append("Die Aktion verarbeitet personenbezogene Daten.")
    if not action.reversible:
        required = True
        reasons.append("Die Aktion ist nicht vollständig reversibel.")
    return ApprovalRecord(
        action=action,
        status=ApprovalStatus.PENDING if required else ApprovalStatus.NOT_REQUIRED,
        reasons=reasons or ["Lokale, reversible Null-Budget-Aktion ohne Außenwirkung."],
    )


def evaluate_experiment(metrics: ExperimentMetrics) -> ExperimentResult:
    profit = round(metrics.revenue_eur - metrics.direct_cost_eur, 2)
    conversion = round(metrics.sales / metrics.leads_contacted * 100, 2) if metrics.leads_contacted else 0
    if metrics.direct_cost_eur > 0:
        return ExperimentResult(verdict="policy_violation", profit_eur=profit, conversion_rate=conversion, next_action="Stoppen und kostenfreie Alternative verwenden.")
    if metrics.sales >= 1 and profit > 0:
        return ExperimentResult(verdict="validated", profit_eur=profit, conversion_rate=conversion, next_action="Angebot standardisieren und kontrolliert skalieren.")
    if metrics.leads_contacted >= 20 and metrics.replies == 0:
        return ExperimentResult(verdict="stopped", profit_eur=profit, conversion_rate=conversion, next_action="Angebot einstellen und Erkenntnisse speichern.")
    return ExperimentResult(verdict="continue", profit_eur=profit, conversion_rate=conversion, next_action="Weiter testen, ohne Budget oder automatische Außenwirkung.")
