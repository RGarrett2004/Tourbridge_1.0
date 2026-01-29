export type AssetType = 'DRUM' | 'AMP' | 'MIC' | 'MONITOR' | 'KEYBOARD' | 'DI' | 'RISER' | 'PERSON' | 'TEXT' | 'UTILITY';

export interface StageAsset {
    id: string;
    type: AssetType;
    label: string; // e.g. "Kick", "Lead Vox"
    x: number;
    y: number;
    rotation?: number; // degrees
    inputs: number; // How many channels this needs (usually 1, stereo keys = 2)

    // New Properties
    description?: string; // e.g. "dw collector's series"
    width?: number;
    height?: number;

    // TecRider Details
    brand?: string; // e.g. "Fender"
    model?: string; // e.g. "Twin Reverb"
    phantom?: boolean; // Needs 48v
    notes?: string; // Longer technical notes
    colorLabel?: string; // Hex code for cable coding

    // Text Styling (for type='TEXT')
    fontSize?: number;
    color?: string;
    fontWeight?: string;
}

export interface InputChannel {
    channel: number;
    name: string;
    mic?: string; // Suggested mic (e.g. "Beta 52")
    stand?: string; // Suggested stand (e.g. "Short Boom")
}
