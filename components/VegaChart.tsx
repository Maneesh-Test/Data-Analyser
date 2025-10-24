import React, { useRef, useEffect } from 'react';
import type { VisualizationSpec } from 'vega-embed';

// Make vegaEmbed available globally
declare const vegaEmbed: any;

interface VegaChartProps {
    spec: object; // Using a generic object because the full Vega-Lite spec is very complex
}

export const VegaChart: React.FC<VegaChartProps> = ({ spec }) => {
    const chartContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartContainer.current && spec && typeof vegaEmbed !== 'undefined') {
            vegaEmbed(chartContainer.current, spec as VisualizationSpec, { actions: true, theme: 'dark' })
                .catch(console.error);
        }
    }, [spec]);

    return <div ref={chartContainer} className="w-full h-full" />;
};
