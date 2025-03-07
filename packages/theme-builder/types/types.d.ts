export type ScaleTypeName = 'radix' | 'radix-b' | 'radius-bold' | 'radius-bright' | 'linear' | 'pastel' | 'pastel-desaturating' | 'neon' | 'neon-bright' | 'neon-c';
export type BuildThemeBasicProperties = {
    id: string;
    color: string;
    scale: ScaleTypeName;
    contrast?: string;
    contrastColor?: string;
    contrastScale?: ScaleTypeName;
    errors?: string[];
};
export type BuildLightDarkTheme = BuildThemeBasicProperties & {
    type: 'lightdark';
};
export type BuildColorSubTheme = BuildThemeBasicProperties & {
    type: 'base';
    subThemeType: 'color';
    name: string;
};
export type BuildMask = {
    id: string;
} & ({
    type: 'strengthen';
    strength: number;
} | {
    type: 'soften';
    strength: number;
} | {
    type: 'inverse';
} | {
    type: 'strengthenBorder';
    strength: number;
} | {
    type: 'softenBorder';
    strength: number;
});
export type BuildMaskSubTheme = {
    id: string;
    type: 'sub';
    subThemeType: 'mask';
    name: string;
    masks: BuildMask[];
    errors?: string[];
};
export type BuildThemeSuiteProps = {
    theme: BuildLightDarkTheme | BuildColorSubTheme | BuildMaskSubTheme;
    fallbackTheme?: BuildColorSubTheme;
};
//# sourceMappingURL=types.d.ts.map