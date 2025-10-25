import type { ContractManagerMCP } from '../index.ts';
import { registerContractAnalysisPrompt } from './contractAnalysis';
import { registerTaskPlanningPrompt } from './taskPlanning';
import { registerTeamAssignmentPrompt } from './teamAssignment';
import { registerProgressReviewPrompt } from './progressReview';
import { registerTagSuggestionsPrompt } from './tagSuggestions';

export async function initializePrompts(agent: ContractManagerMCP) {
  registerContractAnalysisPrompt(agent);
  registerTaskPlanningPrompt(agent);
  registerTeamAssignmentPrompt(agent);
  registerProgressReviewPrompt(agent);
  registerTagSuggestionsPrompt(agent);
}
