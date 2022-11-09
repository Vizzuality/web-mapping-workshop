import { Story } from '@storybook/react/types-6-0';

const StoryMap = {
  title: 'Exercises/Geojson/Points',
  argTypes: {},
};

export default StoryMap;

const Template: Story = () => {
  return (
    <div className="relative w-full h-screen">
      Draw a geojson point collection, center it on the map and display them as
      <ul>
        <li>Images</li>
        <li>color: #ffCC00</li>
      </ul>
    </div>
  );
};

export const Points06 = Template.bind({});
Points06.args = {};
