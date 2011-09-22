/* Configuration file for FlashNotes Keyboard */

Flash.Notes.Keyboard.Config = function () {
	this.TREBLE = 0;
	this.BASS = 1;
	this.ALTO = 2;
	this.TENOR = 3;
	this.TREBLE_OFFSET = 10;
	this.BASS_OFFSET = 12;
	this.ALTO_OFFSET = 11;
	this.TENOR_OFFSET = 9;
	this.PRACTICE_MODE = 0;
	this.GAME_MODE = 1;
	this.MAX_LEVEL = 30;
	this.TIER_1 = 4;
	this.TIER_2 = 14;
	this.TIER_3 = 18;
	this.TIER_4 = 28;
	this.MIN_ATTEMPTS = 5;
	this.MIN_PERCENT = 80;
	this.TIMEOUT = 12;
	this.BONUS = 50;
	this.BONUS_INC = 50;
	this.BONUS_LEVEL = 12;
	this.MAX_LIVES = 5;
	this.RANDOM_TB = 4;
	this.RANDOM_AT = 5;
	this.RANDOM_ALL = 6;
	this.TOGGLE_OFF = 0;
	this.TOGGLE_ON = 1;
	this.TOGGLE_NONE = -1;
	this.MIN_RANGE = 0;
	this.MAX_RANGE = 3;
	this.P_HIGH_PCT = 70;
	this.P_LOW_PCT = 60;
	this.PRACTICE_ATT = 5;
	
	//Note Keymaps
	this.ENTER_KEY = 13;
	this.ESC_KEY = 27;	
	this.UP_KEY = 38;
	this.DOWN_KEY = 40;
	this.KEY_C = 65;
	this.KEY_CS = 87;
	this.KEY_D = 83;
	this.KEY_DS = 69;
	this.KEY_E = 68;
	this.KEY_F = 70;
	this.KEY_FS = 84;
	this.KEY_G = 71;
	this.KEY_GS = 89;
	this.KEY_A = 72;
	this.KEY_AS = 85;
	this.KEY_B = 74;
	this.KEY_C2 = 75;
	
	//Render Sizes
	this.SMALL = "small";
	this.SMALL_W = "small_w";
	this.NORMAL = "normal";
	this.NORMAL_W = "normal_w";
	this.MEDIUM = "medium";
	this.MEDIUM_W = "medium_w";
	this.LARGE = "large";
	this.LARGE_W = "large_w";
	this.HUGE = "huge";
	this.HUGE_W = "huge_w";
	
	//Notation Layer Dimensions
	this.BG_STAVE_LEFT = 20;
	this.BG_STAVE_TOP = 10;
	this.BG_STAVE_WIDTH = 100;
	this.BG_LAYER_WIDTH = 320; 
	this.BG_LAYER_HEIGHT = 200;
	this.FG_STAVE_TOP = 10;
	this.CLEF_LAYER_LEFT = 0;
	this.KS_LAYER_LEFT = 0;
	this.NOTE_LAYER_LEFT = 0;
	this.CLEF_LAYER_WIDTH = 70;
	this.KS_LAYER_WIDTH = 100;
	this.NOTE_LAYER_WIDTH = 146;
	
	//Clef Types
	this.CLEF_TYPES = ["treble", "bass", "alto", "tenor"];
	
	//Note Range Indices
	this.MIN_RANGE_INDEX = 0;
	this.MAX_RANGE_INDEX = 3;
	
	//Accidental & Keysig Levels
	this.ACC_LEVELS = [5, 6, 19, 20];
	this.KS_TIER_1 = [7, 14];
	this.KS_TIER_2 = [21, 30];
	//Use the following with NotationModel.randomKeySignature()
	this.KS_EASY_LEVELS = [7, 8, 11, 12, 21, 22, 25, 26, 29];
	this.KS_HARD_LEVELS = [9, 10, 13, 14, 23, 24, 27, 28, 30];
	this.EASY_KEYS = 0; 
	this.HARD_KEYS = 1;
	
	//Accidental ranges for specific keys - use with NotationModel.randomAccidental()
	this.ACC_SINGLE = 0; //use all accidentals except for natural	
	this.ACC_DOUBLE = 1;
	this.ACC_ALL = 2;
	this.ACC_SINGLE_NOT_C = 3; //use all accidentals 
	this.ACC_ALL_NOT_C = 4;
	this.ACC_NONE = -1;
	this.ACC_TYPE_C = 0;
	this.ACC_TYPE_FLAT = -1;
	this.ACC_TYPE_SHARP = 1;
	this.ACCIDENTAL_ON = {
			'single_acc': false, 
			'double_acc': false
		};
	
	//Key Signature Specs
	this.C = 7;
	this.CS = 14;
	this.CF = 0;
	this.D = 9;
	this.DF = 2;
	this.E = 11;
	this.EF = 4;
	this.F = 6;
	this.FS = 13;
	this.G = 8;
	this.GF = 1;
	this.A = 10;
	this.AF = 3;
	this.B = 12;
	this.BF = 5;
	this.KEY_SIGS = ["Cb", "Gb", "Db", "Ab", "Eb", "Bb", "F", "C", "G", "D", "A", 
						"E", "B", "F#", "C#"];
	this.KS_C_INDEX = 7;
	this.KS_EASY = [this.C, this.G, this.F, this.D, this.BF, this.A, this.EF];
	this.KS_HARD = [this.E, this.AF, this.B, this.DF, this.FS, this.GF, this.CS, this.CF];
	this.KS_SEL_WIDTH = 55;
	this.KS_SEL_HEIGHT = 45;
}