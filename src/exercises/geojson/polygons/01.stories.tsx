import { Story } from '@storybook/react/types-6-0';

const StoryMap = {
  title: 'Exercises/Geojson/Polygons',
  argTypes: {},
};

export default StoryMap;

const Template: Story = () => {
  return (
    <div className="relative w-full h-screen">
      Draw a geojson polygon, center the map on it and color it with this
      <ul>
        <li>color: #ffCC00</li>
        <li>border: #000000</li>
        <li>opacity: 0.5</li>
      </ul>
    </div>
  );
};

export const Polygons01 = Template.bind({});
Polygons01.args = {};
