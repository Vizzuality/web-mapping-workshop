import { Story } from '@storybook/react/types-6-0';

const StoryMap = {
  title: 'Exercises/Geojson/Polygons',
  argTypes: {},
};

export default StoryMap;

const Template: Story = () => {
  return (
    <div className="relative w-full h-screen">
      Draw a geojson polygon collection, center the map on it and color it with this
      <ul>
        <li>color: base on an attribute number [...COLOR_RAMP]</li>
        <li>border: #000000</li>
        <li>opacity: 0.5</li>
      </ul>
    </div>
  );
};

export const Polygons02 = Template.bind({});
Polygons02.args = {};
