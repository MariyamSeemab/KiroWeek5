import { RoutingPath, ValidationError } from '../models';
export interface FormattedOutput {
    header: string;
    body: string;
    footer: string;
    timestamp: string;
}
export declare class OutputFormatter {
    private readonly VERSION;
    constructor();
    formatRoutingPath(route: RoutingPath, format?: 'terminal' | 'json'): FormattedOutput;
    formatValidationErrors(errors: ValidationError[], format?: 'terminal' | 'json'): FormattedOutput;
    formatReliabilityMetrics(route: RoutingPath, format?: 'terminal' | 'json'): FormattedOutput;
    private formatTerminalReliabilityMetrics;
    private formatTerminalRoutingPath;
}
//# sourceMappingURL=OutputFormatter.d.ts.map