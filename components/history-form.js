import { Component } from 'react';
import { string, func, array, bool } from 'prop-types';

/**
 * Components
 */
import Timeline from '../components/timeline';
import TimlineItem from '../components/timeline-item';
import TimelineTextarea from '../components/timeline-textarea';

/**
 * @class Tab
 */
class HitoryForm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => window.scrollTo(0, 0);

  render() {
    const { onSubmit, textComment, onChange, arrHistory, isLoading } = this.props;

    return (
      <div >
        {
          <TimelineTextarea
            onSubmit={ onSubmit }
            textComment={ textComment }
            onChange={ onChange } />
        }
        {
          <Timeline isLoading={ isLoading } >
            {
              arrHistory.map((item, index) =>
                <TimlineItem index={ arrHistory.length - index } key={ `history-list-${item._id}` } { ...item } possition={ index } />
              )
            }
          </Timeline>
        }
      </div>
    );
  }
}

HitoryForm.propTypes = {
  textComment: string,
  arrHistory: array,
  onSubmit: func,
  onChange: func,
  isLoading: bool
};

export default HitoryForm;