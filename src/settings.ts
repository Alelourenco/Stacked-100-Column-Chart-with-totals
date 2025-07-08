/**
 * Configurações de formatação do visual customizado
 * Stacked 100% Column Chart para Power BI
 * 
 * Define as configurações disponíveis no painel de formatação,
 * organizadas em cards temáticos para melhor usabilidade.
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";

// Tipos base do framework de formatação
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * Card de configurações para formatação das categorias do eixo X
 * Permite personalizar aparência dos rótulos das categorias
 */
class CategorySettingsCard extends FormattingSettingsCard {
    // Tamanho da fonte dos rótulos de categoria
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Tamanho da Fonte",
        value: 11
    });

    // Família da fonte dos rótulos
    fontFamily = new formattingSettings.FontPicker({
        name: "fontFamily", 
        displayName: "Família da Fonte",
        value: "Segoe UI"
    });

    // Controle de negrito
    fontBold = new formattingSettings.ToggleSwitch({
        name: "fontBold",
        displayName: "Negrito",
        value: false
    });

    // Cor da fonte
    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Cor da Fonte",
        value: { value: "#000000" }
    });

    name: string = "categorySettings";
    displayName: string = "Configurações de Categoria";
    slices: Array<FormattingSettingsSlice> = [this.fontSize, this.fontFamily, this.fontBold, this.fontColor];
}

/**
 * Card de paleta de cores para as séries do gráfico
 * Define cores personalizadas para até 5 séries diferentes
 */
class ColorPaletteCardSettings extends FormattingSettingsCard {
    // Cores individuais para cada série
    color1 = new formattingSettings.ColorPicker({
        name: "color1",
        displayName: "Cor da Série 1",
        value: { value: "#1f77b4" }
    });

    color2 = new formattingSettings.ColorPicker({
        name: "color2",
        displayName: "Cor da Série 2",
        value: { value: "#ff7f0e" }
    });

    color3 = new formattingSettings.ColorPicker({
        name: "color3",
        displayName: "Cor da Série 3",
        value: { value: "#2ca02c" }
    });

    color4 = new formattingSettings.ColorPicker({
        name: "color4",
        displayName: "Cor da Série 4",
        value: { value: "#d62728" }
    });

    color5 = new formattingSettings.ColorPicker({
        name: "color5",
        displayName: "Cor da Série 5",
        value: { value: "#9467bd" }
    });

    name: string = "colorPalette";
    displayName: string = "Paleta de Cores";
    slices: Array<FormattingSettingsSlice> = [
        this.color1, this.color2, this.color3, this.color4, this.color5
    ];
}

/**
 * Card de opções de formatação dos dados e rótulos
 * Controla exibição e formatação de valores, percentuais e totais
 */
class FormattingCardSettings extends FormattingSettingsCard {
    // Controles de exibição
    showPercent = new formattingSettings.ToggleSwitch({
        name: "showPercent",
        displayName: "Exibir Percentual",
        value: true
    });

    showValues = new formattingSettings.ToggleSwitch({
        name: "showValues",
        displayName: "Exibir Valores",
        value: true
    });

    showSeriesNames = new formattingSettings.ToggleSwitch({
        name: "showSeriesNames",
        displayName: "Exibir Nomes das Séries",
        value: false
    });

    showTotals = new formattingSettings.ToggleSwitch({
        name: "showTotals",
        displayName: "Exibir Totais",
        value: true
    });

    // Formatação de valores numéricos
    valueFormat = new formattingSettings.ItemDropdown({
        name: "valueFormat",
        displayName: "Formato do Valor",
        items: [
            { value: "none", displayName: "Automático" },
            { value: "mil", displayName: "Milhares" },
            { value: "milhao", displayName: "Milhões" }
        ],
        value: { value: "none", displayName: "Automático" }
    });

    // Configurações de aparência dos rótulos
    labelFontSize = new formattingSettings.NumUpDown({
        name: "labelFontSize",
        displayName: "Tamanho da Fonte dos Rótulos",
        value: 12
    });

    labelColor = new formattingSettings.ColorPicker({
        name: "labelColor",
        displayName: "Cor dos Rótulos",
        value: { value: "#ffffff" }
    });

    // Configurações dos totais
    totalFontSize = new formattingSettings.NumUpDown({
        name: "totalFontSize",
        displayName: "Tamanho da Fonte dos Totais",
        value: 11
    });

    totalColor = new formattingSettings.ColorPicker({
        name: "totalColor",
        displayName: "Cor dos Totais",
        value: { value: "#222222" }
    });

    name: string = "formatting";
    displayName: string = "Formatação";
    slices: Array<FormattingSettingsSlice> = [
        this.showPercent, this.showValues, this.showSeriesNames, this.showTotals,
        this.valueFormat, this.labelFontSize, this.labelColor, 
        this.totalFontSize, this.totalColor
    ];
}

/**
 * Card de configurações visuais do gráfico
 * Controla aparência geral das barras, bordas e espaçamentos
 */
class ChartSettingsCardSettings extends FormattingSettingsCard {
    // Transparência das barras
    barOpacity = new formattingSettings.NumUpDown({
        name: "barOpacity",
        displayName: "Opacidade das Barras",
        value: 1
    });

    // Configurações de borda
    borderWidth = new formattingSettings.NumUpDown({
        name: "borderWidth",
        displayName: "Largura da Borda",
        value: 0
    });

    borderColor = new formattingSettings.ColorPicker({
        name: "borderColor",
        displayName: "Cor da Borda",
        value: { value: "#000000" }
    });

    // Espaçamento entre barras (0.0 = sem espaço, 1.0 = máximo espaço)
    spacing = new formattingSettings.NumUpDown({
        name: "spacing",
        displayName: "Espaçamento entre Barras",
        value: 0.2
    });

    name: string = "chartSettings";
    displayName: string = "Configurações do Gráfico";
    slices: Array<FormattingSettingsSlice> = [
        this.barOpacity, this.borderWidth, this.borderColor, this.spacing
    ];
}

/**
 * Modelo principal de configurações do visual
 * Agrupa todos os cards de configuração e define a ordem de exibição
 * no painel de formatação do Power BI
 */
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Instâncias dos cards de configuração
    categorySettingsCard = new CategorySettingsCard();
    colorPaletteCard = new ColorPaletteCardSettings();
    formattingCard = new FormattingCardSettings();
    chartSettingsCard = new ChartSettingsCardSettings();

    // Array que define a ordem de exibição no painel
    cards = [
        this.categorySettingsCard, 
        this.colorPaletteCard, 
        this.formattingCard, 
        this.chartSettingsCard
    ];
}
