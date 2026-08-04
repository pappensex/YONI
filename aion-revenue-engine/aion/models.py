from __future__ import annotations

from enum import Enum
from pydantic import BaseModel, Field


class Decision(str, Enum):
    REJECT = "reject"
    RESEARCH = "research"
    REQUIRE_HUMAN = "require_human_approval"
    APPROVE_PROTOTYPE = "approve_prototype"


class ApprovalStatus(str, Enum):
    NOT_REQUIRED = "not_required"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class ActionType(str, Enum):
    CREATE_LOCAL_ASSET = "create_local_asset"
    PUBLISH = "publish"
    SEND_MESSAGE = "send_message"
    CONFIGURE_PAYMENT = "configure_payment"
    SPEND_MONEY = "spend_money"
    ACCOUNT_CHANGE = "account_change"
    PROCESS_PERSONAL_DATA = "process_personal_data"
    LEGAL_COMMITMENT = "legal_commitment"
    DELETE_OR_OVERWRITE = "delete_or_overwrite"


class Opportunity(BaseModel):
    title: str
    problem: str
    audience: str
    offer: str
    revenue_model: str = "one_time_sale"
    free_distribution_channels: list[str] = Field(default_factory=list)
    evidence: list[str] = Field(default_factory=list)
    estimated_build_hours: float = 0
    estimated_monthly_cost_eur: float = 0
    requires_external_account_action: bool = False


class EvidenceAssessment(BaseModel):
    demand_score: int = Field(ge=0, le=100)
    evidence_quality_score: int = Field(ge=0, le=100)
    monetization_score: int = Field(ge=0, le=100)
    automation_score: int = Field(ge=0, le=100)
    uncertainty_score: int = Field(ge=0, le=100)
    rationale: list[str] = Field(default_factory=list)


class RiskAssessment(BaseModel):
    legal_risk: int = Field(ge=0, le=100)
    financial_risk: int = Field(ge=0, le=100)
    reputation_risk: int = Field(ge=0, le=100)
    execution_risk: int = Field(ge=0, le=100)
    requires_human_approval: bool = False
    blockers: list[str] = Field(default_factory=list)
    mitigations: list[str] = Field(default_factory=list)


class BusinessDecision(BaseModel):
    opportunity: Opportunity
    evidence: EvidenceAssessment
    risk: RiskAssessment
    revenue_score: float
    decision: Decision
    reasons: list[str] = Field(default_factory=list)


class ActionProposal(BaseModel):
    title: str
    action_type: ActionType
    description: str
    touches_external_system: bool = False
    handles_personal_data: bool = False
    reversible: bool = True
    cost_eur: float = 0


class ApprovalRecord(BaseModel):
    action: ActionProposal
    status: ApprovalStatus
    reasons: list[str] = Field(default_factory=list)


class ExperimentMetrics(BaseModel):
    leads_contacted: int = 0
    replies: int = 0
    qualified_leads: int = 0
    sales: int = 0
    revenue_eur: float = 0
    direct_cost_eur: float = 0


class ExperimentResult(BaseModel):
    verdict: str
    profit_eur: float
    conversion_rate: float
    next_action: str


class WebsiteAuditInput(BaseModel):
    business_name: str
    website_text: str
    primary_offer: str
    desired_customer: str
    desired_action: str = "Unverbindlich anfragen"


class AuditFinding(BaseModel):
    priority: str
    area: str
    issue: str
    recommendation: str


class WebsiteAuditReport(BaseModel):
    business_name: str
    overall_score: int
    clarity_score: int
    trust_score: int
    action_score: int
    findings: list[AuditFinding]
    suggested_headline: str
    suggested_cta: str
