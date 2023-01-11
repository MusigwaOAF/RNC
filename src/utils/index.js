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

/**
 * Helps generate a usable format's random color
 * @author Musigwa Pacifique
 * @param {string} [format='hex']
 * @param {string} [type='solo']
 * @param {number} [opacity=1]
 * @returns Either an object representation of the generated color and its matching onColor or
 * an array of objects representation: Generated color, its corresponding
 * tint and shade colors as well as the matching contentColor => 'onColor' for each depending on the passed type value.
 * @example 1. genColor(); ==> '#68f538'
 * @example 2. genColor({ format: 'rgba' }); ==> 'rgba(159, 112, 193, 1)'
 * @example 3. genColor({ format: 'rgba', opacity: 0.8 }); ==> 'rgba(159, 112, 193, 0.8)'
 * @example 4. genColor({ format: 'rgba', opacity: 0.8, type: 'solo' }); ==> 'rgba(156, 121, 83, 0.5)'
 * @example 5. genColor({ format: 'rgba', opacity: 0.8, type: 'shade' }); ==> 'rgba(70, 92, 30, 0.8)'
 * @example 6. genColor({ format: 'rgba', opacity: 0.8, type: 'tint' }); ==> 'rgba(70, 92, 30, 0.8)'
 * @example 7. genColor({ format: 'rgba', opacity: 0.8, type: 'soloTint' }); ==> ["rgba(90, 205, 38, 0.8)", "rgba(156, 225, 125, 0.8)"]
 * @example 8. genColor({ format: 'rgba', opacity: 0.8, type: 'soloShade' }); ==> ["rgba(80, 226, 166, 0.8)", "rgba(32, 90, 66, 0.8)"]
 * @example 9. genColor({ format: 'rgba', opacity: 0.8, type: 'all' }); ==> ["rgba(115, 93, 80, 0.8)", "rgba(171, 158, 150, 0.8)", "rgba(46, 37, 32, 0.8)"]
 */
export const genColor = (args?: ColorGenArgs): ColorGenReturnType | ColorGenReturnType[] => {
  const { format = 'hex', type = 'solo', opacity = 1 } = args ?? {};
  const genNumber = (upper = 256) => Math.floor(Math.random() * upper);
  const calcTint = (value, index = 0.4) => Math.round(value + (255 - value) * index);
  const calcShade = (value, index = 0.4) => Math.round(value * index);

  const toHEX = ([red = 255, green = 255, blue = 255]: number[]) =>
    `#${((red << 16) + (green << 8) + blue).toString(16).padStart(6, '0')}`;
  const toRGBA = ([red = 255, green = 255, blue = 255]: number[], opacity: number = 1) =>
    `rgba(${red}, ${green}, ${blue}, ${opacity})`;

  const genOnColor = ([red = 255, green = 255, blue = 255]: number[]) => {
    const yiq = (red * 299 + green * 587 + blue * 114) / 1000;
    return yiq >= 128 ? 'black' : 'white';
  };

  const red = genNumber(); // 0 - 255
  const green = genNumber(); // 0 - 255
  const blue = genNumber(); // 0 - 255

  const solo = [red, green, blue];
  const tint = [calcTint(red), calcTint(green), calcTint(blue)];
  const shade = [calcShade(red), calcShade(green), calcShade(blue)];

  const formatFn = (array: number[]) => (format === 'rgba' ? toRGBA(array, opacity) : toHEX(array));

  const color = { color: formatFn(solo), onColor: genOnColor(solo) };
  const tintColor = { color: formatFn(tint), onColor: genOnColor(tint) };
  const shadeColor = { color: formatFn(shade), onColor: genOnColor(shade) };

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
    case 'soloTintShade':
      return [color, tintColor, shadeColor];
    default:
      return color;
  }
};

