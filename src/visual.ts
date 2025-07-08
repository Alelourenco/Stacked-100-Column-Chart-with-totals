"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";
import * as d3 from "d3";

// Definição de tipos para melhor tipagem
type Fill = { solid: { color: string } };
type ChartData = {
    category: any;
    series: string;
    y0: number;
    y1: number;
    value: number;
    selectionId: powerbi.extensibility.ISelectionId;
};

// Imports dos tipos do Power BI
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import ISelectionManager = powerbi.extensibility.ISelectionManager;

// Import das configurações do visual
import { VisualFormattingSettingsModel } from "./settings";

/**
 * Visual customizado do Power BI para gráfico de colunas empilhadas 100%
 * Exibe dados categóricos em barras empilhadas onde cada categoria representa 100%
 * do total, permitindo comparação visual de proporções entre séries e categorias.
 */
export class Visual implements IVisual {
    // Elementos principais do DOM e configurações
    private target: HTMLElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    private selectionManager: ISelectionManager;
    private host: powerbi.extensibility.visual.IVisualHost;

    // Configurações de layout
    private readonly MARGIN = { top: 40, right: 20, bottom: 80, left: 40 };
    private readonly MAX_VISIBLE_COLUMNS = 5;
    private readonly MIN_COLUMN_WIDTH = 140;

    constructor(options: VisualConstructorOptions) {
        this.initializeServices(options);
        this.setupContainer();
    }

    /**
     * Inicializa os serviços principais do visual
     */
    private initializeServices(options: VisualConstructorOptions): void {
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;
        this.selectionManager = options.host.createSelectionManager();
        this.host = options.host;
    }

    /**
     * Configura o container principal do visual
     */
    private setupContainer(): void {
        // Limpa conteúdo anterior e define estilos base
        this.target.textContent = "";
        this.target.style.background = "none";
        this.target.style.backgroundColor = "transparent";
        this.target.style.cursor = "default";
        this.target.className = "visual-container";
        
        // Cria container com suporte a scroll horizontal para responsividade
        const container = d3.select(this.target)
            .append("div")
            .style("width", "100%")
            .style("height", "100%")
            .style("overflow-x", "auto")
            .style("overflow-y", "hidden")
            .style("background", "none")
            .style("background-color", "transparent")
            .style("cursor", "default");

        // Cria elemento SVG principal
        this.svg = container.append("svg")
            .attr("height", "100%")
            .style("background", "none")
            .style("background-color", "transparent")
            .style("cursor", "default");
    }

    /**
     * Método principal de atualização do visual
     * Chamado sempre que há mudanças nos dados ou configurações
     */
    public update(options: VisualUpdateOptions) {
        // Carrega configurações de formatação do modelo de dados
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            options.dataViews[0]
        );

        // Calcula dimensões do visual
        const { width, height } = options.viewport;
        const chartWidth = width - this.MARGIN.left - this.MARGIN.right;
        const chartHeight = height - this.MARGIN.top - this.MARGIN.bottom;

        // Limpa o SVG antes de redesenhar
        this.svg.selectAll("*").remove();

        // Valida e processa dados
        const dataView = options.dataViews?.[0];
        if (!this.isDataViewValid(dataView)) {
            return;
        }

        const processedData = this.processData(dataView);
        if (processedData.categories.length === 0) {
            return;
        }

        // Configura dimensões responsivas
        const dimensions = this.calculateDimensions(processedData.categories.length, width, height);
        this.svg.attr("width", dimensions.totalWidth).attr("height", height);

        // Cria escalas para o gráfico
        const scales = this.createScales(processedData.categories, dimensions.availableWidth, chartHeight);

        // Renderiza componentes do gráfico
        this.renderChart(processedData, scales, dimensions, chartHeight);
    }

    /**
     * Valida se o dataView contém dados válidos
     */
    private isDataViewValid(dataView: powerbi.DataView): boolean {
        return !!(dataView?.categorical?.categories?.[0]?.values && dataView?.categorical?.values);
    }

    /**
     * Processa os dados brutos do Power BI em formato utilizável pelo visual
     */
    private processData(dataView: powerbi.DataView): { categories: any[], data: ChartData[], totals: number[] } {
        const categoryColumn = dataView.categorical.categories[0];
        const categories = categoryColumn.values;
        const values = dataView.categorical.values;
        const seriesCount = values.length;

        // Filtra apenas categorias com valores positivos
        const { filteredCategories, filteredIndexes } = this.filterValidCategories(categories, values, seriesCount);

        // Processa dados para barras empilhadas com cálculo preciso de percentuais
        const data = this.createStackedData(filteredCategories, filteredIndexes, values, seriesCount, categoryColumn);

        // Calcula totais por categoria
        const totals = this.calculateTotals(filteredCategories, filteredIndexes, values, seriesCount);

        return { categories: filteredCategories, data, totals };
    }

    /**
     * Filtra categorias que possuem pelo menos um valor positivo
     */
    private filterValidCategories(categories: any[], values: powerbi.DataViewValueColumns, seriesCount: number) {
        const filteredCategories: any[] = [];
        const filteredIndexes: number[] = [];

        for (let i = 0; i < categories.length; i++) {
            const hasPositiveValue = this.hasPositiveValueInCategory(values, seriesCount, i);
            if (hasPositiveValue) {
                filteredCategories.push(categories[i]);
                filteredIndexes.push(i);
            }
        }

        return { filteredCategories, filteredIndexes };
    }

    /**
     * Verifica se uma categoria possui pelo menos um valor positivo
     */
    private hasPositiveValueInCategory(values: powerbi.DataViewValueColumns, seriesCount: number, categoryIndex: number): boolean {
        for (let j = 0; j < seriesCount; j++) {
            if (+values[j].values[categoryIndex] > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Cria dados para barras empilhadas com cálculo preciso de percentuais
     */
    private createStackedData(
        filteredCategories: any[], 
        filteredIndexes: number[], 
        values: powerbi.DataViewValueColumns, 
        seriesCount: number, 
        categoryColumn: powerbi.DataViewCategoryColumn
    ): ChartData[] {
        const data: ChartData[] = [];

        for (let idx = 0; idx < filteredCategories.length; idx++) {
            const originalIndex = filteredIndexes[idx];
            
            // Coleta valores válidos (positivos) da categoria
            const categoryData = this.collectCategoryData(values, seriesCount, originalIndex);
            
            if (categoryData.length === 0) continue;

            const total = categoryData.reduce((sum, item) => sum + item.value, 0);
            if (total <= 0) continue;

            // Calcula percentuais garantindo soma exata de 100%
            let y0 = 0;
            let cumulativePercentage = 0;
            
            for (let k = 0; k < categoryData.length; k++) {
                const item = categoryData[k];
                let percentage: number;
                
                // Último item: usa restante para garantir 100%
                if (k === categoryData.length - 1) {
                    percentage = 1.0 - cumulativePercentage;
                } else {
                    percentage = item.value / total;
                    cumulativePercentage += percentage;
                }
                
                const y1 = y0 + percentage;
                
                data.push({
                    category: filteredCategories[idx],
                    series: item.series,
                    y0,
                    y1,
                    value: item.value,
                    selectionId: this.host.createSelectionIdBuilder()
                        .withCategory(categoryColumn, originalIndex)
                        .withSeries(values, values[item.seriesIndex])
                        .createSelectionId()
                });
                
                y0 = y1;
            }
        }

        return data;
    }

    /**
     * Coleta dados válidos de uma categoria específica
     */
    private collectCategoryData(values: powerbi.DataViewValueColumns, seriesCount: number, categoryIndex: number) {
        const categoryData: any[] = [];
        
        for (let j = 0; j < seriesCount; j++) {
            const value = +values[j].values[categoryIndex];
            if (value > 0) {
                categoryData.push({
                    series: values[j].source.displayName,
                    value: value,
                    seriesIndex: j
                });
            }
        }
        
        return categoryData;
    }

    /**
     * Calcula totais por categoria (apenas valores positivos)
     */
    private calculateTotals(filteredCategories: any[], filteredIndexes: number[], values: powerbi.DataViewValueColumns, seriesCount: number): number[] {
        return filteredCategories.map((_, idx) => {
            const originalIndex = filteredIndexes[idx];
            let sum = 0;
            
            for (let j = 0; j < seriesCount; j++) {
                const value = +values[j].values[originalIndex];
                if (value > 0) {
                    sum += value;
                }
            }
            
            return sum;
        });
    }

    /**
     * Calcula dimensões responsivas do gráfico
     */
    private calculateDimensions(categoriesCount: number, width: number, height: number) {
        const visibleWidth = this.MAX_VISIBLE_COLUMNS * this.MIN_COLUMN_WIDTH;
        const paddingSpace = categoriesCount * this.MIN_COLUMN_WIDTH * this.formattingSettings.chartSettingsCard.spacing.value;
        const totalWidth = Math.max(visibleWidth, categoriesCount * this.MIN_COLUMN_WIDTH + paddingSpace);
        const availableWidth = totalWidth - this.MARGIN.left - this.MARGIN.right;

        return { totalWidth, availableWidth };
    }

    /**
     * Cria escalas D3 para o gráfico
     */
    private createScales(categories: any[], availableWidth: number, chartHeight: number) {
        const x = d3.scaleBand()
            .domain(categories.map(String))
            .range([0, availableWidth])
            .padding(this.formattingSettings.chartSettingsCard.spacing.value);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([chartHeight, 0]);

        return { x, y };
    }

    /**
     * Renderiza todos os componentes do gráfico
     */
    private renderChart(processedData: any, scales: any, dimensions: any, chartHeight: number): void {
        const dataView = this.formattingSettings; // Para usar no contexto atual
        
        // Renderiza barras
        this.renderBars(processedData.data, scales, chartHeight);
        
        // Renderiza totais (se habilitado)
        if (this.formattingSettings.formattingCard.showTotals.value) {
            this.renderTotals(processedData.categories, processedData.totals, scales, chartHeight);
        }
        
        // Renderiza rótulos das barras
        this.renderBarLabels(processedData.data, scales);
        
        // Renderiza eixo X
        this.renderXAxis(scales.x, chartHeight);
        
        // Configura interatividade
        this.setupInteractivity(processedData.data);
    }

    /**
     * Renderiza as barras empilhadas
     */
    private renderBars(data: ChartData[], scales: any, chartHeight: number): void {
        const barGroups = this.svg.append("g")
            .attr("transform", `translate(${this.MARGIN.left},${this.MARGIN.top})`)
            .selectAll("g")
            .data(this.getUniqueCategories(data))
            .join("g")
            .attr("transform", (d: any) => `translate(${scales.x(String(d))},0)`);

        const rects = barGroups.selectAll("rect")
            .data((d: any) => data.filter(row => row.category === d))
            .join("rect")
            .attr("y", (d: any) => scales.y(d.y1))
            .attr("height", (d: any) => scales.y(d.y0) - scales.y(d.y1))
            .attr("width", scales.x.bandwidth())
            .attr("fill", (d: any) => this.getSeriesColor(d.series, data))
            .attr("stroke", this.formattingSettings.chartSettingsCard.borderColor.value.value)
            .attr("stroke-width", this.formattingSettings.chartSettingsCard.borderWidth.value)
            .attr("opacity", this.formattingSettings.chartSettingsCard.barOpacity.value);

        // Armazena referência para uso posterior
        this.svg.property("rects", rects);
    }

    /**
     * Obtém categorias únicas dos dados
     */
    private getUniqueCategories(data: ChartData[]): any[] {
        return Array.from(new Set(data.map(d => d.category)));
    }

    /**
     * Obtém cor da série baseada na configuração
     */
    private getSeriesColor(seriesName: string, data: ChartData[]): string {
        // Encontra índice da série
        const seriesIndex = data.findIndex(d => d.series === seriesName);
        
        // Paleta de cores personalizada
        const colorPalette = [
            this.formattingSettings.colorPaletteCard.color1.value.value,
            this.formattingSettings.colorPaletteCard.color2.value.value,
            this.formattingSettings.colorPaletteCard.color3.value.value,
            this.formattingSettings.colorPaletteCard.color4.value.value,
            this.formattingSettings.colorPaletteCard.color5.value.value
        ];

        return colorPalette[seriesIndex % colorPalette.length] || "#1f77b4";
    }

    /**
     * Renderiza rótulos de totais acima das barras
     */
    private renderTotals(categories: any[], totals: number[], scales: any, chartHeight: number): void {
        this.svg.append("g")
            .attr("transform", `translate(${this.MARGIN.left},${this.MARGIN.top})`)
            .selectAll("text.total-label")
            .data(categories)
            .join("text")
            .attr("class", "total-label")
            .attr("x", (d: any) => scales.x(String(d))! + scales.x.bandwidth() / 2)
            .attr("y", scales.y(1) - 10)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", `${this.formattingSettings.formattingCard.totalFontSize.value}px`)
            .style("fill", this.formattingSettings.formattingCard.totalColor.value.value)
            .text((d: any, i: number) => this.formatValue(totals[i]));
    }

    /**
     * Renderiza rótulos dentro das barras
     */
    private renderBarLabels(data: ChartData[], scales: any): void {
        const that = this;
        
        const barGroups = this.svg.select("g").selectAll("g");
        
        barGroups.selectAll("text.bar-label")
            .data((d: any) => data.filter(row => row.category === d))
            .join("text")
            .attr("class", "bar-label")
            .attr("x", scales.x.bandwidth() / 2)
            .attr("y", (d: any) => (scales.y(d.y1) + scales.y(d.y0)) / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("fill", this.formattingSettings.formattingCard.labelColor.value.value)
            .style("font-size", `${this.formattingSettings.formattingCard.labelFontSize.value}px`)
            .each(function(d: any) {
                that.renderBarLabelContent(d3.select(this), d, scales);
            })
            .append("title")
            .text((d: any) => {
                const percent = d.y1 - d.y0;
                return `${d.series}\n${d3.format(".1%")(percent)}\n${that.formatValue(d.value)}`;
            });

        // Armazena referência para uso posterior
        this.svg.property("textLabels", barGroups.selectAll("text.bar-label"));
    }

    /**
     * Renderiza conteúdo dos rótulos das barras
     */
    private renderBarLabelContent(labelGroup: any, d: any, scales: any): void {
        const percent = d.y1 - d.y0;
        const barHeight = scales.y(d.y0) - scales.y(d.y1);
        
        labelGroup.text(null);
        
        // Verifica se há espaço suficiente
        if (d.value <= 0 || barHeight <= 20) return;

        const showSeries = this.formattingSettings.formattingCard.showSeriesNames.value;
        const showPercent = this.formattingSettings.formattingCard.showPercent.value;
        const showValues = this.formattingSettings.formattingCard.showValues.value;
        
        // Conta linhas e calcula offset
        let lineCount = 0;
        if (showSeries && barHeight > 45) lineCount++;
        if (showPercent) lineCount++;
        if (showValues) lineCount++;
        
        const initialOffset = lineCount > 1 ? -(lineCount - 1) * 0.5 : 0;
        let currentLine = 0;
        
        // Renderiza nome da série
        if (showSeries && barHeight > 45) {
            labelGroup.append("tspan")
                .attr("x", scales.x.bandwidth() / 2)
                .attr("dy", `${initialOffset + currentLine}em`)
                .style("font-weight", "bold")
                .style("font-size", `${Math.max(this.formattingSettings.formattingCard.labelFontSize.value - 1, 8)}px`)
                .text(d.series);
            currentLine++;
        }
        
        // Renderiza percentual
        if (showPercent) {
            labelGroup.append("tspan")
                .attr("x", scales.x.bandwidth() / 2)
                .attr("dy", currentLine === 0 ? `${initialOffset}em` : "1.2em")
                .text(d3.format(".1%")(percent));
            currentLine++;
        }
        
        // Renderiza valores
        if (showValues) {
            labelGroup.append("tspan")
                .attr("x", scales.x.bandwidth() / 2)
                .attr("dy", currentLine === 0 ? `${initialOffset}em` : "1.2em")
                .text(this.formatValue(d.value));
        }
    }

    /**
     * Renderiza eixo X com formatação personalizada
     */
    private renderXAxis(xScale: any, chartHeight: number): void {
        const xAxis = this.svg.append("g")
            .attr("transform", `translate(${this.MARGIN.left},${chartHeight + this.MARGIN.top + 5})`)
            .call(d3.axisBottom(xScale));

        // Remove linhas do eixo
        xAxis.select("path.domain").attr("stroke", "none");
        xAxis.selectAll("line").attr("stroke", "none");

        // Aplica formatação personalizada
        xAxis.selectAll("text")
            .style("text-anchor", "middle")
            .style("font-size", `${this.formattingSettings.categorySettingsCard.fontSize.value}px`)
            .style("font-family", this.formattingSettings.categorySettingsCard.fontFamily.value)
            .style("font-weight", this.formattingSettings.categorySettingsCard.fontBold.value ? "bold" : "normal")
            .style("fill", this.formattingSettings.categorySettingsCard.fontColor.value.value)
            .call((selection: any) => this.wrapAxisLabels(selection, xScale.bandwidth()));
    }

    /**
     * Configura interatividade (seleção e eventos)
     */
    private setupInteractivity(data: ChartData[]): void {
        const rects = this.svg.property("rects");
        const textLabels = this.svg.property("textLabels");
        
        // Função para atualizar opacidade baseada na seleção
        const updateOpacityAndLabels = () => {
            const selectionIds = this.selectionManager.getSelectionIds();
            const baseOpacity = this.formattingSettings.chartSettingsCard.barOpacity.value;
            
            if (!selectionIds || selectionIds.length === 0) {
                rects.attr("opacity", baseOpacity);
                textLabels.style("display", "");
                return;
            }
            
            const selectedCategories = this.getSelectedCategories(selectionIds, data);
            
            rects.attr("opacity", (d: any) => {
                const isSelected = selectedCategories.has(d.category);
                return isSelected ? baseOpacity : baseOpacity * 0.3;
            });
            
            textLabels.style("display", (d: any) => {
                const isSelected = selectedCategories.has(d.category);
                return isSelected ? "" : "none";
            });
        };

        // Aplica estado inicial
        updateOpacityAndLabels();

        // Evento de click nas barras
        rects.on("click", (event: any, d: any) => {
            const isCtrlPressed = (event.ctrlKey || event.metaKey);
            this.selectionManager.select(d.selectionId, isCtrlPressed).then(() => {
                updateOpacityAndLabels();
            });
            event.stopPropagation();
        });

        // Evento de click no fundo para limpar seleção
        this.svg.on("click", () => {
            this.selectionManager.clear().then(() => {
                updateOpacityAndLabels();
            });
        });
    }

    /**
     * Obtém categorias selecionadas
     */
    private getSelectedCategories(selectionIds: powerbi.extensibility.ISelectionId[], data: ChartData[]): Set<any> {
        const selectedCategories = new Set();
        
        selectionIds.forEach(selectionId => {
            const matchingItem = data.find(item => 
                (item.selectionId as any).key === (selectionId as any).key
            );
            if (matchingItem) {
                selectedCategories.add(matchingItem.category);
            }
        });
        
        return selectedCategories;
    }

    /**
     * Formata valores com moeda e escala
     */
    private formatValue(val: number): string {
        // Detecta formato de moeda dos dados originais
        let prefix = "";
        // Nota: seria ideal acessar o formato original, mas por simplicidade usamos detectores básicos
        
        const absVal = Math.abs(val);
        let divisor = 1;
        let suffix = "";

        // Aplica formatação baseada na configuração do usuário
        const valueFormat = this.formattingSettings.formattingCard.valueFormat.value.value;
        
        switch (valueFormat) {
            case "milhao":
                divisor = 1e6;
                suffix = " Mi";
                break;
            case "mil":
                divisor = 1e3;
                suffix = " Mil";
                break;
            case "none":
            default:
                // Formatação automática
                if (absVal >= 1e9) {
                    divisor = 1e9;
                    suffix = " Bi";
                } else if (absVal >= 1e6) {
                    divisor = 1e6;
                    suffix = " Mi";
                } else if (absVal >= 1e3) {
                    divisor = 1e3;
                    suffix = " Mil";
                }
                break;
        }

        return prefix + (val / divisor).toLocaleString("pt-BR", { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        }) + suffix;
    }

    /**
     * Quebra rótulos do eixo X para caber na largura disponível
     */
    private wrapAxisLabels(selection: d3.Selection<any, any, any, any>, colWidth: number): void {
        selection.each(function() {
            const text = d3.select(this);
            const label = text.text();
            text.text(null);

            // Calcula caracteres que cabem na largura
            const maxChars = Math.floor(colWidth / 8);

            // Quebra em duas linhas se possível e necessário
            if (label.length > maxChars && label.includes(" ") && colWidth > 70) {
                const breakIdx = label.lastIndexOf(" ", maxChars) || maxChars;
                
                text.append("tspan")
                    .attr("x", 0)
                    .attr("dy", 0)
                    .text(label.slice(0, breakIdx));
                    
                text.append("tspan")
                    .attr("x", 0)
                    .attr("dy", "1.1em")
                    .text(label.slice(breakIdx + 1));
            } else {
                // Trunca com reticências se necessário
                const displayText = label.length > maxChars 
                    ? label.slice(0, maxChars - 1) + "…" 
                    : label;
                    
                text.append("tspan")
                    .attr("x", 0)
                    .attr("dy", 0)
                    .text(displayText);
            }
        });
    }

    /**
     * Retorna modelo de formatação para o painel de propriedades
     */
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    /**
     * Enumera instâncias de objetos para compatibilidade com versões antigas
     */
    public enumerateObjectInstances(options: powerbi.EnumerateVisualObjectInstancesOptions): powerbi.VisualObjectInstance[] | powerbi.VisualObjectInstanceEnumerationObject {
        if (this.formattingSettingsService && this.formattingSettings && (this.formattingSettingsService as any).buildEnumerateObjectInstances) {
            return (this.formattingSettingsService as any).buildEnumerateObjectInstances(this.formattingSettings, options);
        }
        return [];
    }
}
