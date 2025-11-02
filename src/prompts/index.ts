import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { registerContractAnalysisPrompt } from './contractAnalysis.js';
import { registerTaskPlanningPrompt } from './taskPlanning.js';
import { registerTeamAssignmentPrompt } from './teamAssignment.js';
import { registerProgressReviewPrompt } from './progressReview.js';
import { registerTagSuggestionsPrompt } from './tagSuggestions.js';

export async function initializePrompts(agent: ContractManagerMCP) {
  registerContractAnalysisPrompt(agent);
  registerTaskPlanningPrompt(agent);
  registerTeamAssignmentPrompt(agent);
  registerProgressReviewPrompt(agent);
  registerTagSuggestionsPrompt(agent);
}
