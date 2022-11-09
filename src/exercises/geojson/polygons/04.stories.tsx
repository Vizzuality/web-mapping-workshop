import { Story } from '@storybook/react/types-6-0';

const StoryMap = {
  title: 'Exercises/Geojson/Polygons',
  argTypes: {},
};

export default StoryMap;

const Template: Story = () => {
  return (
    <div className="relative w-full h-screen">
      Draw a geojson polygon collection, center the map on it and color it with this and apply a
      hover effect
      <ul>
        <li>Polygon</li>
        <li>color: base on an attribute category [...COLOR_RAMP]</li>
        <li>border: #000000</li>
        <li>opacity: 0.5</li>

        <li>Hover</li>
        <li>color: #000000</li>
      </ul>
    </div>
  );
};

export const Polygons03 = Template.bind({});
Polygons03.args = {};
