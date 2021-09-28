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

export const genColor = (type = 'solo', format = 'hex', opacity = 1) => {
  // type can be oneOf(['solo' || 'tint' || 'shade' || 'soloTint' || 'soloShade' || 'tintShade' || 'all'])
  // format can oneOf(['hex', 'rgba'])
  // opacity can be oneOf([number, array[numbers]])
  const red = genNumber(); // 0 - 255
  const green = genNumber(); // 0 - 255
  const blue = genNumber(); // 0 - 255

  const formatFn = (array) => format === 'rgba' ? toRGBA(array, opacity) : toHEX(array);

  const solo = [red, green, blue];
  const tint = [calcTint(red), calcTint(green), calcTint(blue)];
  const shade = [calcShade(red), calcShade(green), calcShade(blue)];

  switch (type) {
    case 'solo':
      return formatFn(solo);
    case 'tint':
      return formatFn(tint);
    case 'shade':
      return formatFn(shade);
    case 'soloTint':
      return [formatFn(solo), formatFn(tint)];
    case 'soloShade':
      return [formatFn(solo), formatFn(shade)];
    case 'tintShade':
      return [formatFn(tint), formatFn(shade)];
    case 'all':
      return [formatFn(solo), formatFn(tint), formatFn(shade)];
    default:
      return formatFn(solo);
  }
};
