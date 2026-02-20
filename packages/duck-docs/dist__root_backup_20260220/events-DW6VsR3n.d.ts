import { z } from "zod";

//#region src/lib/events.d.ts
declare const eventSchema: z.ZodObject<{
  name: z.ZodEnum<{
    copy_npm_command: "copy_npm_command";
    copy_usage_import_code: "copy_usage_import_code";
    copy_usage_code: "copy_usage_code";
    copy_primitive_code: "copy_primitive_code";
    copy_theme_code: "copy_theme_code";
    copy_block_code: "copy_block_code";
    copy_chunk_code: "copy_chunk_code";
    enable_lift_mode: "enable_lift_mode";
    copy_chart_code: "copy_chart_code";
    copy_chart_theme: "copy_chart_theme";
    copy_chart_data: "copy_chart_data";
    copy_color: "copy_color";
  }>;
  properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
}, z.core.$strip>;
type Event = z.infer<typeof eventSchema>;
declare function trackEvent(input: Event): void;
//#endregion
export { trackEvent as n, Event as t };
//# sourceMappingURL=events-DW6VsR3n.d.ts.map