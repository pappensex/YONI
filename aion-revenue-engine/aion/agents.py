from __future__ import annotations

import os

from .models import BusinessDecision, EvidenceAssessment, Opportunity, RiskAssessment
from .policy import decide


def api_ready() -> bool:
    return bool(os.environ.get("OPENAI_API_KEY"))


def _model_name() -> str:
    return os.environ.get("AION_MODEL", "gpt-5-mini")


async def evaluate_prompt(prompt: str) -> BusinessDecision:
    """Run Scout, Evidence and Risk agents, then apply deterministic policy."""
    if not api_ready():
        raise RuntimeError("OPENAI_API_KEY is not configured securely.")

    from agents import Agent, Runner

    scout = Agent(
        name="Scout",
        model=_model_name(),
        instructions=(
            "Develop exactly one lawful zero-budget digital revenue opportunity for a narrow audience. "
            "Use only free distribution. Do not invent market evidence, sales, customers or guarantees. "
            "Prefer a prototype below twelve hours. Mark missing evidence explicitly."
        ),
        output_type=Opportunity,
    )
    evidence_agent = Agent(
        name="Evidence",
        model=_model_name(),
        instructions=(
            "Assess only the supplied opportunity and its stated evidence. Penalize anecdotes, vanity metrics, "
            "unsupported demand and missing willingness-to-pay evidence. Keep uncertainty high when proof is weak."
        ),
        output_type=EvidenceAssessment,
    )
    risk_agent = Agent(
        name="Risk",
        model=_model_name(),
        instructions=(
            "Perform a skeptical pre-mortem. Flag legal, financial, privacy, safety, platform, execution and "
            "reputation risks. Require human approval for spending, publishing, outreach, payment or account changes, "
            "contracts, personal data and irreversible actions."
        ),
        output_type=RiskAssessment,
    )

    opportunity = (await Runner.run(scout, prompt, max_turns=4)).final_output
    evidence = (await Runner.run(evidence_agent, opportunity.model_dump_json(), max_turns=4)).final_output
    risk = (await Runner.run(risk_agent, opportunity.model_dump_json(), max_turns=4)).final_output
    return decide(opportunity, evidence, risk)
