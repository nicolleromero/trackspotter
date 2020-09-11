const { Autocomplete, Component, PropTypes, useState, useCallback } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;


function Autosuggest(props) {
  let [labelValue, setLabelValue] = React.useState('');


  const GENRES = [
    { "id": 0, label: "Acid House" }, { "id": 1, label: "Acid Jazz" }, { "id": 2, label: "Acid Rock" }, { "id": 3, label: "Acid Techno" }, { "id": 4, label: "Acoustic Blues" }, { "id": 5, label: "African Jazz" }, { "id": 6, label: "Afro-Beat" }, { "id": 7, label: "Afro-Brazilian" }, { "id": 8, label: "Afro - Cuban" }, { "id": 9, label: "Album Rock" }, { "id": 10, label: "Alternative CCM" }, { "id": 11, label: "Alternative Country" }, { "id": 12, label: "Alternative Dance" }, { "id": 13, label: "Alternative Metal" }, { "id": 14, label: "Alternative Pop / Rock" }, { "id": 15, label: "Alternative Rap" }, { "id": 16, label: "Ambient" }, { "id": 17, label: "Ambient Dub" }, { "id": 18, label: "Ambient House" }, { "id": 19, label: "Ambient Pop" }, { "id": 20, label: "Ambient Techno" }, { "id": 21, label: "Americana" }, { "id": 22, label: "AM Pop" }, { "id": 23, label: "Andalus Classical" }, { "id": 24, label: "Anti - Folk" }, { "id": 25, label: "Appalachian Folk" }, { "id": 26, label: "Armenian" }, { "id": 27, label: "Armenian Folk" }, { "id": 28, label: "Asian Folk" }, { "id": 29, label: "AustroPop" }, { "id": 30, label: "Avant - Garde" }, { "id": 31, label: "Avant - Garde Jazz" }, { "id": 32, label: "Bachata" }, { "id": 33, label: "Bakersfield Sound" }, { "id": 34, label: "Banda" }, { "id": 35, label: "Baroque" }, { "id": 36, label: "Baroque Pop" }, { "id": 37, label: "Bass Music" }, { "id": 38, label: "Beach" }, { "id": 39, label: "Beat Poetry" }, { "id": 40, label: "Bhangra" },
    { "id": 41, label: "Big Band" }, { "id": 42, label: "Big Beat" }, { "id": 43, label: "Bikutsi" }, { "id": 44, label: "Bluegrass" }, { "id": 45, label: "Bluegrass - Gospel" }, { "id": 46, label: "Blues" }, { "id": 47, label: "Blues Gospel" }, { "id": 48, label: "Blues - Rock" }, { "id": 49, label: "Bolero" }, { "id": 50, label: "Bollywood" }, { "id": 51, label: "Boogaloo" }, { "id": 52, label: "Boogie - Woogie" }, { "id": 53, label: "Bop" }, { "id": 54, label: "Bossa Nova" }, { "id": 55, label: "Brass Band" }, { "id": 56, label: "Brazilian Jazz" }, { "id": 57, label: "Brazilian Pop" }, { "id": 58, label: "Brill Building Pop" }, { "id": 59, label: "British Blues" }, { "id": 60, label: "British Folk" }, { "id": 61, label: "British Invasion" }, { "id": 62, label: "British Metal" }, { "id": 63, label: "Britpop" }, { "id": 64, label: "Broken Beat" }, { "id": 65, label: "Bubblegum" }, { "id": 66, label: "Bulgarian Folk" }, { "id": 67, label: "C - 86" }, { "id": 68, label: "Cabaret" }, { "id": 69, label: "Cadence" }, { "id": 70, label: "Cajun" }, { "id": 71, label: "Calypso" }, { "id": 72, label: "Canterbury Scene" }, { "id": 73, label: "Carnatic" }, { "id": 74, label: "CCM" }, { "id": 75, label: "Celtic" }, { "id": 76, label: "Celtic Rock" }, { "id": 77, label: "Cha - Cha" }, { "id": 78, label: "Chamber Pop" }, { "id": 79, label: "Chant" }, { "id": 80, label: "Charanga" }, { "id": 81, label: "Chicago Blues" }, { "id": 82, label: "Chicago Soul" }, { "id": 83, label: "Children's" },
    { "id": 84, label: "Children's Folk" }, { "id": 85, label: "Chinese Classical" }, { "id": 86, label: "Chinese Folk" }, { "id": 87, label: "Chinese Pop" }, { "id": 88, label: "Choral" }, { "id": 89, label: "Choro" }, { "id": 90, label: "Christian Metal" }, { "id": 91, label: "Christian Punk" }, { "id": 92, label: "Christian Rap" }, { "id": 93, label: "Christian Rock" }, { "id": 94, label: "Christmas" }, { "id": 95, label: "Classical" }, { "id": 96, label: "Classical Guitar" }, { "id": 97, label: "Classic Jazz" }, { "id": 98, label: "Comedy" }, { "id": 99, label: "Comedy Rap" }, { "id": 100, label: "Comedy Rock" }, { "id": 101, label: "Contemporary Country" }, { "id": 102, label: "Contemporary Folk" }, { "id": 103, label: "Contemporary Gospel" }, { "id": 104, label: "Contemporary Jazz" }, { "id": 105, label: "Contemporary Native American" }, { "id": 106, label: "Cool" }, { "id": 107, label: "Corrido" }, { "id": 108, label: "Country" }, { "id": 109, label: "Country Blues" }, { "id": 110, label: "Country Boogie" }, { "id": 111, label: "Country - Folk" }, { "id": 112, label: "Country Gospel" }, { "id": 113, label: "Country - Pop" }, { "id": 114, label: "Country - Rock" }, { "id": 115, label: "Cowboy" }, { "id": 116, label: "Cowpunk" }, { "id": 117, label: "Cuatro" }, { "id": 118, label: "Cuban Jazz" }, { "id": 119, label: "Cumbia" }, { "id": 120, label: "Dancehall" }, { "id": 121, label: "Dance - Pop" }, { "id": 122, label: "Dance - Rock" }, { "id": 123, label: "Dark Ambient" }, { "id": 124, label: "Deep Funk" },
    { "id": 125, label: "Deep Soul" }, { "id": 126, label: "Delta Blues" }, { "id": 127, label: "Detroit Techno" }, { "id": 128, label: "Dhrupad" }, { "id": 129, label: "Dirty Rap" }, { "id": 130, label: "Dirty South" }, { "id": 131, label: "Disco" }, { "id": 132, label: "Dixieland" }, { "id": 133, label: "DJ" }, { "id": 134, label: "Doom Metal" }, { "id": 135, label: "Doo Wop" }, { "id": 136, label: "Downtempo" }, { "id": 137, label: "Drama" }, { "id": 138, label: "Dream Pop" }, { "id": 139, label: "Drill'n'bass" }, { "id": 140, label: "Dub" }, { "id": 141, label: "Dub Poetry" }, { "id": 142, label: "Dutch Pop" }, { "id": 143, label: "Early Music" }, { "id": 144, label: "Easter" }, { "id": 145, label: "Easy Listening" }, { "id": 146, label: "Electric Blues" }, { "id": 147, label: "Electro" }, { "id": 148, label: "Electro - Industrial" }, { "id": 149, label: "Electro - Jazz" }, { "id": 150, label: "Electronic" }, { "id": 151, label: "Electronica" }, { "id": 152, label: "Emo" }, { "id": 153, label: "Enka" }, { "id": 154, label: "Environmental" }, { "id": 155, label: "Erotica" }, { "id": 156, label: "Ethiopian Pop" }, { "id": 157, label: "Exotica" }, { "id": 158, label: "Experimental" }, { "id": 159, label: "Experimental Ambient" }, { "id": 160, label: "Experimental Big Band" }, { "id": 161, label: "Experimental Dub" }, { "id": 162, label: "Experimental Electro" }, { "id": 163, label: "Experimental Rock" }, { "id": 164, label: "Experimental Techno" }, { "id": 165, label: "Fado" }, { "id": 166, label: "Fantasy" },
    { "id": 167, label: "Finnish Folk" }, { "id": 168, label: "Flamenco" }, { "id": 169, label: "Folk" }, { "id": 170, label: "Folklore" }, { "id": 171, label: "Folk - Pop" }, { "id": 172, label: "Folk Revival" }, { "id": 173, label: "Folk - Rock" }, { "id": 174, label: "Forro" }, { "id": 175, label: "Freakbeat" }, { "id": 176, label: "Free Folk" }, { "id": 177, label: "Free Improvisation" }, { "id": 178, label: "Free Jazz" }, { "id": 179, label: "Freestyle" }, { "id": 180, label: "French Folk" }, { "id": 181, label: "French Pop" }, { "id": 182, label: "French Rock" }, { "id": 183, label: "Fuji" }, { "id": 184, label: "Funk" }, { "id": 185, label: "Funk Metal" }, { "id": 186, label: "Funky Breaks" }, { "id": 187, label: "Fusion" }, { "id": 188, label: "Gabba" }, { "id": 189, label: "Gamelan" }, { "id": 190, label: "Gangsta Rap" }, { "id": 191, label: "Garage Punk" }, { "id": 192, label: "Garage Rock" }, { "id": 193, label: "Garage Rock Revival" }, { "id": 194, label: "Gay" }, { "id": 195, label: "G - Funk" }, { "id": 196, label: "Girl Group" }, { "id": 197, label: "Glam Rock" }, { "id": 198, label: "Glitch" }, { "id": 199, label: "Glitter" }, { "id": 200, label: "Goa Trance" }, { "id": 201, label: "Go - Go" }, { "id": 202, label: "Gospel" }, { "id": 203, label: "Goth Metal" }, { "id": 204, label: "Goth Rock" }, { "id": 205, label: "Greek Folk" }, { "id": 206, label: "Grindcore" }, { "id": 207, label: "Grunge" }, { "id": 208, label: "Gypsy" }, { "id": 209, label: "Halloween" }, { "id": 210, label: "Happy Hardcore" },
    { "id": 211, label: "Hard Bop" }, { "id": 212, label: "Hardcore Punk" }, { "id": 213, label: "Hardcore Techno" }, { "id": 214, label: "Hard Rock" }, { "id": 215, label: "Harmonica Blues" }, { "id": 216, label: "Harmony Vocal Group" }, { "id": 217, label: "Healing" }, { "id": 218, label: "Heartland Rock" }, { "id": 219, label: "Heavy Metal" }, { "id": 220, label: "Highlife" }, { "id": 221, label: "Hi - NRG" }, { "id": 222, label: "Hip - Hop" }, { "id": 223, label: "Honky Tonk" }, { "id": 224, label: "House" }, { "id": 225, label: "IDM" }, { "id": 226, label: "Illbient" }, { "id": 227, label: "Improvisation" }, { "id": 228, label: "Indian Classical" }, { "id": 229, label: "Indian Folk" }, { "id": 230, label: "Indian Pop" }, { "id": 231, label: "Indie Electronic" }, { "id": 232, label: "Indie Pop" }, { "id": 233, label: "Indie Rock" }, { "id": 234, label: "Indigenous" }, { "id": 235, label: "Industrial" }, { "id": 236, label: "Industrial Metal" }, { "id": 237, label: "Instrumental Rock" }, { "id": 238, label: "Inuit" }, { "id": 239, label: "Irish Folk" }, { "id": 240, label: "Italian Folk" }, { "id": 241, label: "Italian Pop" }, { "id": 242, label: "Jangle Pop" }, { "id": 243, label: "Japanese Pop" }, { "id": 244, label: "Japanese Rock" }, { "id": 245, label: "Jazz" }, { "id": 246, label: "Jazz Blues" }, { "id": 247, label: "Jazz - Funk" }, { "id": 248, label: "Jazz - Rap" }, { "id": 249, label: "Jazz - Rock" }, { "id": 250, label: "Jug Band" }, { "id": 251, label: "Juju" }, { "id": 252, label: "Jump Blues" },
    { "id": 253, label: "Karaoke" }, { "id": 254, label: "Kayokyoku" }, { "id": 255, label: "Klezmer" }, { "id": 256, label: "Kora" }, { "id": 257, label: "Korean Pop" }, { "id": 258, label: "Korean Rock" }, { "id": 259, label: "L.A.Punk" }, { "id": 260, label: "Latin" }, { "id": 261, label: "Latin Comedy" }, { "id": 262, label: "Latin Folk" }, { "id": 263, label: "Latin Jazz" }, { "id": 264, label: "Latin Pop" }, { "id": 265, label: "Latin Rap" }, { "id": 266, label: "Latin Rock" }, { "id": 267, label: "Lo - Fi" }, { "id": 268, label: "Louisiana Blues" }, { "id": 269, label: "Lounge" }, { "id": 270, label: "Lovers Rock" }, { "id": 271, label: "Madchester" }, { "id": 272, label: "Makossa" }, { "id": 273, label: "Mambo" }, { "id": 274, label: "March" }, { "id": 275, label: "Mariachi" }, { "id": 276, label: "Math Rock" }, { "id": 277, label: "Mbalax" }, { "id": 278, label: "Mbira" }, { "id": 279, label: "Medieval" }, { "id": 280, label: "Meditation" }, { "id": 281, label: "Memphis Blues" }, { "id": 282, label: "Memphis Soul" }, { "id": 283, label: "Mento" }, { "id": 284, label: "Merengue" }, { "id": 285, label: "Merseybeat" }, { "id": 286, label: "Microhouse" }, { "id": 287, label: "Microtonal" }, { "id": 288, label: "Military" }, { "id": 289, label: "Minimalism" }, { "id": 290, label: "Minimal Techno" }, { "id": 291, label: "Mod" }, { "id": 292, label: "Modern Big Band" }, { "id": 293, label: "Modern Free" }, { "id": 294, label: "Mod Revival" }, { "id": 295, label: "Moravian Folk" }, { "id": 296, label: "Morna" },
    { "id": 297, label: "Motown" }, { "id": 298, label: "MPB" }, { "id": 299, label: "Musette" }, { "id": 300, label: "Music Hall" }, { "id": 301, label: "Neo - Classical" }, { "id": 302, label: "Neo - Classical Metal" }, { "id": 303, label: "Neo - Prog" }, { "id": 304, label: "Neo - Soul" }, { "id": 305, label: "Neo - Traditional" }, { "id": 306, label: "New Age" }, { "id": 307, label: "New Jack Swing" }, { "id": 308, label: "New Orleans Blues" }, { "id": 309, label: "New Orleans Jazz" }, { "id": 310, label: "New Romantic" }, { "id": 311, label: "New Wave" }, { "id": 312, label: "Noh" }, { "id": 313, label: "Noise" }, { "id": 314, label: "Noise Pop" }, { "id": 315, label: "Noise - Rock" }, { "id": 316, label: "Norteño" }, { "id": 317, label: "Northern Soul" }, { "id": 318, label: "Norwegian Folk" }, { "id": 319, label: "Novelty" }, { "id": 320, label: "No Wave" }, { "id": 321, label: "Nu Breaks" }, { "id": 322, label: "Nueva Cancion" }, { "id": 323, label: "Nueva Trova" }, { "id": 324, label: "Nyahbinghi" }, { "id": 325, label: "Oi!" }, { "id": 326, label: "Okinawan Pop" }, { "id": 327, label: "Opera" }, { "id": 328, label: "Orchestral" }, { "id": 329, label: "Outlaw Country" }, { "id": 330, label: "Paisley Underground" }, { "id": 331, label: "Philly Soul" }, { "id": 332, label: "Piano Blues" }, { "id": 333, label: "Piedmont Blues" }, { "id": 334, label: "Plena" }, { "id": 335, label: "Poetry" }, { "id": 336, label: "Polka" }, { "id": 337, label: "Pop" }, { "id": 338, label: "Pop Idol" }, { "id": 339, label: "Pop - Rap" },
    { "id": 340, label: "Pop / Rock" }, { "id": 341, label: "Pop Underground" }, { "id": 342, label: "Portuguese Music" }, { "id": 343, label: "Post - Bop" }, { "id": 344, label: "Post - Disco" }, { "id": 345, label: "Post - Grunge" }, { "id": 346, label: "Post - Hardcore" }, { "id": 347, label: "Post - Minimalism" }, { "id": 348, label: "Post - Punk" }, { "id": 349, label: "Post - Romantic" }, { "id": 350, label: "Power Metal" }, { "id": 351, label: "Power Pop" }, { "id": 352, label: "Progressive Alternative" }, { "id": 353, label: "Progressive Bluegrass" }, { "id": 354, label: "Progressive House" }, { "id": 355, label: "Progressive Jazz" }, { "id": 356, label: "Progressive Metal" }, { "id": 357, label: "Progressive Trance" }, { "id": 358, label: "Psychedelic" }, { "id": 359, label: "Psychedelic Pop" }, { "id": 360, label: "Psychobilly" }, { "id": 361, label: "Pub Rock" }, { "id": 362, label: "Punk" }, { "id": 363, label: "Punk Blues" }, { "id": 364, label: "Punk - Pop" }, { "id": 365, label: "Punk Revival" }, { "id": 366, label: "Qawwali" }, { "id": 367, label: "Queercore" }, { "id": 368, label: "Quiet Storm" }, { "id": 369, label: "Ragga" }, { "id": 370, label: "Ragtime" }, { "id": 371, label: "Rai" }, { "id": 372, label: "Rakugo" }, { "id": 373, label: "Ranchera" }, { "id": 374, label: "Rap" }, { "id": 375, label: "Rap - Metal" }, { "id": 376, label: "Rap - Rock" }, { "id": 377, label: "Rave" }, { "id": 378, label: "R & B" }, { "id": 379, label: "Reggae" }, { "id": 380, label: "Reggae Gospel" }, { "id": 381, label: "Reggae - Pop" },
    { "id": 382, label: "Reggaeton" }, { "id": 383, label: "Renaissance" }, { "id": 384, label: "Retro - Soul" }, { "id": 385, label: "Riot Grrrl" }, { "id": 386, label: "Rock" }, { "id": 387, label: "Rockabilly" }, { "id": 388, label: "Rock en Español" }, { "id": 389, label: "Rock & Roll" }, { "id": 390, label: "Romantic" }, { "id": 391, label: "Roots Reggae" }, { "id": 392, label: "Roots Rock" }, { "id": 393, label: "Russian Folk" }, { "id": 394, label: "Salsa" }, { "id": 395, label: "Samba" }, { "id": 396, label: "Scottish Folk" }, { "id": 397, label: "Screamo" }, { "id": 398, label: "S√©ga" }, { "id": 399, label: "Shaabi" }, { "id": 400, label: "Shibuya - Kei" }, { "id": 401, label: "Shoegaze" }, { "id": 402, label: "Show Tunes" }, { "id": 403, label: "Singer / Songwriter" }, { "id": 404, label: "Ska" }, { "id": 405, label: "Ska - Punk" }, { "id": 406, label: "Ska Revival" }, { "id": 407, label: "Skiffle" }, { "id": 408, label: "Slack - Key Guitar" }, { "id": 409, label: "Slowcore" }, { "id": 410, label: "Sludge Metal" }, { "id": 411, label: "Smooth Jazz" }, { "id": 412, label: "Smooth Soul" }, { "id": 413, label: "Soca" }, { "id": 414, label: "Soft Rock" }, { "id": 415, label: "Son" }, { "id": 416, label: "Soukous" }, { "id": 417, label: "Soul" }, { "id": 418, label: "Soul - Blues" }, { "id": 419, label: "Soul - Jazz" }, { "id": 420, label: "Sound Art" }, { "id": 421, label: "Sound Collage" }, { "id": 422, label: "Sound Effects" }, { "id": 423, label: "Soundtrack" }, { "id": 424, label: "South African Pop" },
    { "id": 425, label: "Southern Gospel" }, { "id": 426, label: "Southern Rock" }, { "id": 427, label: "Southern Soul" }, { "id": 428, label: "Space" }, { "id": 429, label: "Space Age Pop" }, { "id": 430, label: "Space Rock" }, { "id": 431, label: "Spanish Folk" }, { "id": 432, label: "Speed Metal" }, { "id": 433, label: "Spiritual" }, { "id": 434, label: "Spirituals" }, { "id": 435, label: "Spoken Word" }, { "id": 436, label: "Standards" }, { "id": 437, label: "Stoner Metal" }, { "id": 438, label: "Straight - Edge" }, { "id": 439, label: "Stride" }, { "id": 440, label: "Sunshine Pop" }, { "id": 441, label: "Surf" }, { "id": 442, label: "Swamp Blues" }, { "id": 443, label: "Swamp Pop" }, { "id": 444, label: "Swedish Folk" }, { "id": 445, label: "Swing" }, { "id": 446, label: "Symphonic Black Metal" }, { "id": 447, label: "Taiwanese Pop" }, { "id": 448, label: "Tango" }, { "id": 449, label: "Tech - House" }, { "id": 450, label: "Techno" }, { "id": 451, label: "Techno - Dub" }, { "id": 452, label: "Teen Pop" }, { "id": 453, label: "Tejano" }, { "id": 454, label: "Texas Blues" }, { "id": 455, label: "Tex - Mex" }, { "id": 456, label: "Thai Pop" }, { "id": 457, label: "Thrash" }, { "id": 458, label: "Throat Singing" }, { "id": 459, label: "Timba" }, { "id": 460, label: "Traditional" }, { "id": 461, label: "Traditional Bluegrass" }, { "id": 462, label: "Traditional Chinese" }, { "id": 463, label: "Traditional Country" }, { "id": 464, label: "Traditional Folk" }, { "id": 465, label: "Traditional Japanese" }, { "id": 466, label: "Traditional Korean" },
    { "id": 467, label: "Traditional Scottish Folk" }, { "id": 468, label: "Trad Jazz" }, { "id": 469, label: "Trance" }, { "id": 470, label: "Tribal - House" }, { "id": 471, label: "Trip - Hop" }, { "id": 472, label: "Tropical" }, { "id": 473, label: "Trot" }, { "id": 474, label: "Trova" }, { "id": 475, label: "Truck Driving Country" }, { "id": 476, label: "Turkish Folk" }, { "id": 477, label: "Turntablism" }, { "id": 478, label: "Twee Pop" }, { "id": 479, label: "Underground Rap" }, { "id": 480, label: "Urban" }, { "id": 481, label: "Vallenato" }, { "id": 482, label: "Vaudeville" }, { "id": 483, label: "Video" }, { "id": 484, label: "Video Game Music" }, { "id": 485, label: "Vocal" }, { "id": 486, label: "Vocal Jazz" }, { "id": 487, label: "West Coast Rap" }, { "id": 488, label: "Western Swing" }, { "id": 489, label: "Women's" }, { "id": 490, label: "World" }, { "id": 491, label: "World Fusion" }, { "id": 492, label: "Yodeling" }, { "id": 493, label: "Zouk" }, { "id": 494, label: "Zydeco" }
  ]

  function handleOnSelect(value) {
    setLabelValue(value);
    props.setParam(value);
  }

  return (
    <ReactAutocomplete
      items={GENRES}
      shouldItemRender={(item, value) => item.label.toLowerCase().indexOf(value.toLowerCase()) > -1}
      getItemValue={item => item.label}
      renderItem={(item, highlighted) =>
        <div
          key={item.id}
          style={{ backgroundColor: highlighted ? '#eee' : 'transparent' }}
        >
          {item.label}
        </div>
      }
      inputProps={{ placeholder: props.placeholder, className: props.className }}
      value={labelValue}
      onChange={(e) => setLabelValue(e.target.value)}
      onSelect={handleOnSelect}
    />
  )
}


// Code to generate list of genre labels

// let GENRES = ['Acid House', 'Acid Jazz', 'Acid Rock', 'Acid Techno', 'Acoustic Blues', 'African Jazz', 'Afro-Beat', 'Afro-Brazilian', 'Afro - Cuban', 'Album Rock', 'Alternative CCM', 'Alternative Country', 'Alternative Dance', 'Alternative Metal', 'Alternative Pop / Rock', 'Alternative Rap', 'Ambient', 'Ambient Dub', 'Ambient House', 'Ambient Pop', 'Ambient Techno', 'Americana', 'AM Pop', 'Andalus Classical', 'Anti - Folk', 'Appalachian Folk', 'Armenian', 'Armenian Folk', 'Asian Folk', 'AustroPop', 'Avant - Garde', 'Avant - Garde Jazz', 'Bachata', 'Bakersfield Sound', 'Banda', 'Baroque', 'Baroque Pop', 'Bass Music', 'Beach', 'Beat Poetry', 'Bhangra', 'Big Band', 'Big Beat', 'Bikutsi', 'Bluegrass', 'Bluegrass - Gospel', 'Blues', 'Blues Gospel', 'Blues - Rock', 'Bolero', 'Bollywood', 'Boogaloo', 'Boogie - Woogie', 'Bop', 'Bossa Nova', 'Brass Band', 'Brazilian Jazz', 'Brazilian Pop', 'Brill Building Pop', 'British Blues', 'British Folk', 'British Invasion', 'British Metal', 'Britpop', 'Broken Beat', 'Bubblegum', 'Bulgarian Folk', 'C - 86', 'Cabaret', 'Cadence', 'Cajun', 'Calypso', 'Canterbury Scene', 'Carnatic', 'CCM', 'Celtic', 'Celtic Rock', 'Cha - Cha', 'Chamber Pop', 'Chant', 'Charanga', 'Chicago Blues', 'Chicago Soul', "Children's", "Children's Folk", 'Chinese Classical', 'Chinese Folk', 'Chinese Pop', 'Choral', 'Choro', 'Christian Metal', 'Christian Punk', 'Christian Rap', 'Christian Rock', 'Christmas', 'Classical', 'Classical Guitar', 'Classic Jazz', 'Comedy', 'Comedy Rap', 'Comedy Rock', 'Contemporary Country', 'Contemporary Folk', 'Contemporary Gospel', 'Contemporary Jazz',
//   'Contemporary Native American', 'Cool', 'Corrido', 'Country', 'Country Blues', 'Country Boogie', 'Country - Folk', 'Country Gospel', 'Country - Pop', 'Country - Rock', 'Cowboy', 'Cowpunk', 'Cuatro', 'Cuban Jazz', 'Cumbia', 'Dancehall', 'Dance - Pop', 'Dance - Rock', 'Dark Ambient', 'Deep Funk', 'Deep Soul', 'Delta Blues', 'Detroit Techno', 'Dhrupad', 'Dirty Rap', 'Dirty South', 'Disco', 'Dixieland', 'DJ', 'Doom Metal', 'Doo Wop', 'Downtempo', 'Drama', 'Dream Pop', "Drill'n'bass", 'Dub', 'Dub Poetry', 'Dutch Pop', 'Early Music', 'Easter', 'Easy Listening', 'Electric Blues', 'Electro', 'Electro - Industrial', 'Electro - Jazz', 'Electronic', 'Electronica', 'Emo', 'Enka', 'Environmental', 'Erotica', 'Ethiopian Pop', 'Exotica', 'Experimental', 'Experimental Ambient', 'Experimental Big Band', 'Experimental Dub', 'Experimental Electro', 'Experimental Rock', 'Experimental Techno', 'Fado', 'Fantasy', 'Finnish Folk', 'Flamenco', 'Folk', 'Folklore', 'Folk - Pop', 'Folk Revival', 'Folk - Rock', 'Forro', 'Freakbeat', 'Free Folk', 'Free Improvisation', 'Free Jazz', 'Freestyle', 'French Folk', 'French Pop', 'French Rock', 'Fuji', 'Funk', 'Funk Metal', 'Funky Breaks', 'Fusion', 'Gabba', 'Gamelan', 'Gangsta Rap', 'Garage Punk', 'Garage Rock', 'Garage Rock Revival', 'Gay', 'G - Funk', 'Girl Group', 'Glam Rock', 'Glitch', 'Glitter', 'Goa Trance', 'Go - Go', 'Gospel', 'Goth Metal', 'Goth Rock', 'Greek Folk', 'Grindcore', 'Grunge', 'Gypsy', 'Halloween', 'Happy Hardcore', 'Hard Bop', 'Hardcore Punk', 'Hardcore Techno', 'Hard Rock', 'Harmonica Blues',
//   'Harmony Vocal Group', 'Healing', 'Heartland Rock', 'Heavy Metal', 'Highlife', 'Hi - NRG', 'Hip - Hop', 'Honky Tonk', 'House', 'IDM', 'Illbient', 'Improvisation', 'Indian Classical', 'Indian Folk', 'Indian Pop', 'Indie Electronic', 'Indie Pop', 'Indie Rock', 'Indigenous', 'Industrial', 'Industrial Metal', 'Instrumental Rock', 'Inuit', 'Irish Folk', 'Italian Folk', 'Italian Pop', 'Jangle Pop', 'Japanese Pop', 'Japanese Rock', 'Jazz', 'Jazz Blues', 'Jazz - Funk', 'Jazz - Rap', 'Jazz - Rock', 'Jug Band', 'Juju', 'Jump Blues', 'Karaoke', 'Kayokyoku', 'Klezmer', 'Kora', 'Korean Pop', 'Korean Rock', 'L.A.Punk', 'Latin', 'Latin Comedy', 'Latin Folk', 'Latin Jazz', 'Latin Pop', 'Latin Rap', 'Latin Rock', 'Lo - Fi', 'Louisiana Blues', 'Lounge', 'Lovers Rock', 'Madchester', 'Makossa', 'Mambo', 'March', 'Mariachi', 'Math Rock', 'Mbalax', 'Mbira', 'Medieval', 'Meditation', 'Memphis Blues', 'Memphis Soul', 'Mento', 'Merengue', 'Merseybeat', 'Microhouse', 'Microtonal', 'Military', 'Minimalism', 'Minimal Techno', 'Mod', 'Modern Big Band', 'Modern Free', 'Mod Revival', 'Moravian Folk', 'Morna', 'Motown', 'MPB', 'Musette', 'Music Hall', 'Neo - Classical', 'Neo - Classical Metal', 'Neo - Prog', 'Neo - Soul', 'Neo - Traditional', 'New Age', 'New Jack Swing', 'New Orleans Blues', 'New Orleans Jazz', 'New Romantic', 'New Wave', 'Noh', 'Noise', 'Noise Pop', 'Noise - Rock', 'Norteño', 'Northern Soul', 'Norwegian Folk', 'Novelty', 'No Wave', 'Nu Breaks', 'Nueva Cancion', 'Nueva Trova', 'Nyahbinghi', 'Oi!', 'Okinawan Pop', 'Opera', 'Orchestral',
//   'Outlaw Country', 'Paisley Underground', 'Philly Soul', 'Piano Blues', 'Piedmont Blues', 'Plena', 'Poetry', 'Polka', 'Pop', 'Pop Idol', 'Pop - Rap', 'Pop / Rock', 'Pop Underground', 'Portuguese Music', 'Post - Bop', 'Post - Disco', 'Post - Grunge', 'Post - Hardcore', 'Post - Minimalism', 'Post - Punk', 'Post - Romantic', 'Power Metal', 'Power Pop', 'Progressive Alternative', 'Progressive Bluegrass', 'Progressive House', 'Progressive Jazz', 'Progressive Metal', 'Progressive Trance', 'Psychedelic', 'Psychedelic Pop', 'Psychobilly', 'Pub Rock', 'Punk', 'Punk Blues', 'Punk - Pop', 'Punk Revival', 'Qawwali', 'Queercore', 'Quiet Storm', 'Ragga', 'Ragtime', 'Rai', 'Rakugo', 'Ranchera', 'Rap', 'Rap - Metal', 'Rap - Rock', 'Rave', 'R & B', 'Reggae', 'Reggae Gospel', 'Reggae - Pop', 'Reggaeton', 'Renaissance', 'Retro - Soul', 'Riot Grrrl', 'Rock', 'Rockabilly', 'Rock en Español', 'Rock & Roll', 'Romantic', 'Roots Reggae', 'Roots Rock', 'Russian Folk', 'Salsa', 'Samba', 'Scottish Folk', 'Screamo', 'S√©ga', 'Shaabi', 'Shibuya - Kei', 'Shoegaze', 'Show Tunes', 'Singer / Songwriter', 'Ska', 'Ska - Punk', 'Ska Revival', 'Skiffle', 'Slack - Key Guitar', 'Slowcore', 'Sludge Metal', 'Smooth Jazz', 'Smooth Soul', 'Soca', 'Soft Rock', 'Son', 'Soukous', 'Soul', 'Soul - Blues', 'Soul - Jazz', 'Sound Art', 'Sound Collage', 'Sound Effects', 'Soundtrack', 'South African Pop', 'Southern Gospel', 'Southern Rock', 'Southern Soul', 'Space', 'Space Age Pop', 'Space Rock', 'Spanish Folk', 'Speed Metal', 'Spiritual', 'Spirituals', 'Spoken Word', 'Standards', 'Stoner Metal', 'Straight - Edge',
//   'Stride', 'Sunshine Pop', 'Surf', 'Swamp Blues', 'Swamp Pop', 'Swedish Folk', 'Swing', 'Symphonic Black Metal', 'Taiwanese Pop', 'Tango', 'Tech - House', 'Techno', 'Techno - Dub', 'Teen Pop', 'Tejano', 'Texas Blues', 'Tex - Mex', 'Thai Pop', 'Thrash', 'Throat Singing', 'Timba', 'Traditional', 'Traditional Bluegrass', 'Traditional Chinese', 'Traditional Country', 'Traditional Folk', 'Traditional Japanese', 'Traditional Korean', 'Traditional Scottish Folk', 'Trad Jazz', 'Trance', 'Tribal - House', 'Trip - Hop', 'Tropical', 'Trot', 'Trova', 'Truck Driving Country', 'Turkish Folk', 'Turntablism', 'Twee Pop', 'Underground Rap', 'Urban', 'Vallenato', 'Vaudeville', 'Video', 'Video Game Music', 'Vocal', 'Vocal Jazz', 'West Coast Rap', 'Western Swing', "Women's", 'World', 'World Fusion', 'Yodeling', 'Zouk', 'Zydeco'
// ]

// let items = GENRES.map((label, i) => {
//   let rObj = {}
//   rObj['id'] = i
//   rObj['label'] = label
//   return rObj
// })

// process.stdout.write(JSON.stringify(items) + '\n');
