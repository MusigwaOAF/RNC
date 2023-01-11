export const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const updateSize = () => {
      const { innerWidth: width, innerHeight: height } = window;
      setSize({ width, height });
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

export const numberDelimiter = number => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const genNumber = (upper = 256) => Math.floor(Math.random() * upper);

const toHEX = ([red = 255, green = 255, blue = 255]) => `#${((red << 16) + (green << 8) + blue).toString(16).padStart(6, '0')}`;

const toRGBA = ([red = 255, green = 255, blue = 255], opacity = 1) => `rgba(${red}, ${green}, ${blue}, ${opacity})`;

const calcTint = (value, index = .0001) => Math.round(value + (255 - value) * index);

const calcShade = (value, index = .4) => Math.round(value * index);

/**
 * Helps generate a usable format's random color
 * @author Musigwa Pacifique
 * @param {string} [format='hex']
 * @param {string} [type='solo']
 * @param {number} [opacity=1]
 * @returns {string | string[]}
 * Returns either a string representation of the generated color or
 * an array of strings: Generated color, and its corresponding
 * tint and shade colors depending on the passed arguments
 * @example 1. genColor(); ==> '#68f538'
 * @example 2. genColor({ format: 'rgba' }); ==> 'rgba(159, 112, 193, 1)'
 * @example 3. genColor({ format: 'rgba', opacity: 0.8 }); ==> 'rgba(159, 112, 193, 0.8)'
 * @example 4. genColor({ format: 'rgba', opacity: 0.8, type: 'solo' }); ==> 'rgba(156, 121, 83, 0.5)'
 * @example 5. genColor({ format: 'rgba', opacity: 0.8, type: 'shade' }); ==> 'rgba(70, 92, 30, 0.8)'
 * @example 6. genColor({ format: 'rgba', opacity: 0.8, type: 'tint' }); ==> 'rgba(70, 92, 30, 0.8)'
 * @example 7. genColor({ format: 'rgba', opacity: 0.8, type: 'soloTint' }); ==> ["rgba(68, 211, 54, 0.8)", "rgba(68, 211, 54, 0.8)"]
 * @example 8. genColor({ format: 'rgba', opacity: 0.8, type: 'soloShade' }); ==> ["rgba(80, 226, 166, 0.8)", "rgba(32, 90, 66, 0.8)"]
 * @example 9. genColor({ format: 'rgba', opacity: 0.8, type: 'all' }); ==> ["rgba(115, 93, 80, 0.8)", "rgba(171, 158, 150, 0.8)", "rgba(46, 37, 32, 0.8)"]
 */
export const genColor = (args?: ColorGenArgs) => {
  const { format = 'hex', type = 'solo', opacity = 1 } = args ?? {};
  const genNumber = (upper = 256) => Math.floor(Math.random() * upper);
  const calcTint = (value, index = 0.4) => Math.round(value + (255 - value) * index);
  const calcShade = (value, index = 0.4) => Math.round(value * index);

  const red = genNumber(); // 0 - 255
  const green = genNumber(); // 0 - 255
  const blue = genNumber(); // 0 - 255

  const solo = [red, green, blue];
  const tint = [calcTint(red), calcTint(green), calcTint(blue)];
  const shade = [calcShade(red), calcShade(green), calcShade(blue)];

  // Find out the color's contrast.
  const yiq = (red * 299 + green * 587 + blue * 114) / 1000;
  const contentColor = yiq >= 128 ? 'black' : 'white';

  const toHEX = ([red = 255, green = 255, blue = 255]: number[]) =>
    `#${((red << 16) + (green << 8) + blue).toString(16).padStart(6, '0')}`;
  const toRGBA = ([red = 255, green = 255, blue = 255]: number[], opacity: number = 1) =>
    `rgba(${red}, ${green}, ${blue}, ${opacity})`;

  const formatFn = (array: number[]) => (format === 'rgba' ? toRGBA(array, opacity) : toHEX(array));

  const color = formatFn(solo);
  const tintColor = formatFn(tint);
  const shadeColor = formatFn(shade);

  switch (type) {
    case 'solo':
      return color;
    case 'tint':
      return tintColor;
    case 'shade':
      return shadeColor;
    case 'soloTint':
      return [color, tintColor];
    case 'soloShade':
      return [color, shadeColor];
    case 'tintShade':
      return [tintColor, shadeColor];
    case 'all':
      return [color, tintColor, shadeColor];
    default:
      return color;
  }
};

