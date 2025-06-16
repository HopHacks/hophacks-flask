import { useState } from 'react';
import '../../../stylesheets/user_auth.css';

const CATEGORIES = {
  stage: {
    names: ['None', 'Branch', 'Stump'],
    range: [0, 2]
  },
  accessory: {
    names: [
      'None',
      'Headphones',
      'Halo',
      'Flowers',
      'Party hat',
      'Book',
      'Sprout',
      'Flower',
      'Glasses',
      ''
    ],
    range: [0, 8]
  },
  object: {
    names: ['None', 'Coffee', 'Boba', 'Lemonade', 'Burger', 'Plant', 'Laptop'],
    range: [0, 6]
  }
};
const COLOR_CATEGORIES = {
  Body: {
    colors: ['#313079', '#2a4785', '#417b9f', '#6a9bd6', '#8db8ef'],
    range: [1, 5]
  },
  Accent: {
    colors: ['#c44c82', '#644e7a', '#a9bf79', '#dfc186', '#d9784c', '#dd505a'],
    range: [1, 6]
  }
};

const ColorPicker = ({ onSelect, colors, category }) => (
  <div className="flex flex-col items-center justify-center">
    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
      {colors.map((color, index) => (
        <div
          key={color}
          className="color-select"
          style={{ backgroundColor: color }}
          tabIndex="0"
          onClick={() => onSelect(index + 1)}
        />
      ))}
      {category === 'Accent' && (
        <div
          className="color-select text-white text-xs flex items-center"
          style={{ background: 'None' }}
          onClick={() => onSelect(0)}
        >
          None
        </div>
      )}
    </div>
  </div>
);

const ColorSelect = ({ onSelect, category }) => {
  return (
    <div className="w-full">
      <ColorPicker
        onSelect={onSelect}
        colors={COLOR_CATEGORIES[category]['colors']}
        category={category}
      />
    </div>
  );
};

const ScrollSelect = ({ selected, setSelected, category }) => {
  const properties = CATEGORIES[category];
  const handleIncrement = () => {
    if (selected >= properties.range[1]) {
      setSelected(properties.range[0]);
    } else {
      setSelected((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (selected <= properties.range[0]) {
      setSelected(properties.range[1]);
    } else {
      setSelected((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <p className="text-white font-bold pb-3">{category}</p>
      <div className="flex flex-col items-center">
        <button onClick={handleIncrement} className="w-8 pb-3">
          <img src="/images/select-arrow.svg" className="w-full h-auto max-h-full object-contain" />
        </button>
        {/* <p className='py-3 font-bold text-white'>
          {properties.names[properties.range[0] === 0 ? selected : selected + 1]}
        </p> */}
        <button onClick={handleDecrement} className="w-8">
          <img
            src="/images/select-arrow.svg"
            className="w-full h-auto max-h-full object-contain rotate-180"
          />
        </button>
      </div>
    </div>
  );
};

export default function SignUpImage({
  stage,
  setStage,
  body,
  setBody,
  accent,
  setAccent,
  accessory,
  setAccessory,
  object,
  setObject
}) {
  const [colorSelector, setColorSelector] = useState('Body');

  return (
    <div className="w-full bg-[#5997CC] rounded-[40px] p-6 md:p-8 grid grid-rows-[auto_1fr] gap-6 md:gap-8 max-w-4xl mx-auto">
      {/* Top Row: 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image Container */}
        <div className="bg-white aspect-square rounded-[24px] flex items-center justify-center p-4">
          <img
            className="w-full h-full object-contain"
            src={`https://hophacks-website.s3.us-east-1.amazonaws.com/pfps/${stage}_${body}_1_${accent}_${accessory}_${object}.png`}
            alt="Profile"
          />
        </div>

        {/* Customization Panel */}
        <div className="flex flex-col justify-between space-y-4 py-2">
          <div className="bg-[rgba(225,233,242,.32)] rounded-lg text-white text-center font-bold text-lg md:text-xl p-3">
            Customize your blue jay!
          </div>

          <div className="flex justify-center gap-2">
            {['Body', 'Accent'].map((category) => (
              <button
                key={category}
                className={`flex-1 rounded-md text-white font-semibold py-2 transition ${
                  colorSelector === category ? 'bg-[#2885D4]' : 'bg-white/20 hover:bg-white/30'
                }`}
                onClick={() => setColorSelector(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <ColorSelect
            onSelect={colorSelector === 'Body' ? setBody : setAccent}
            category={colorSelector}
          />
        </div>
      </div>

      {/* Bottom Row: 3 columns */}
      <div className="grid grid-cols-3 gap-4">
        <ScrollSelect selected={stage} setSelected={setStage} category="stage" />
        <ScrollSelect selected={accessory} setSelected={setAccessory} category="accessory" />
        <ScrollSelect selected={object} setSelected={setObject} category="object" />
      </div>
    </div>
  );
}
