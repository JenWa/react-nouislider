import React from "react";
import PropTypes from "prop-types";

import nouislider from "nouislider";

import { isEqual } from "./utils";

class Nouislider extends React.Component {
  sliderContainer = React.createRef();

  componentDidMount() {
    const { clickablePips, disabled } = this.props;
    const sliderHTML = this.sliderContainer.current;
    if (sliderHTML) {
      this.toggleDisable(disabled);
      this.createSlider();
      if (clickablePips)
        sliderHTML.querySelectorAll(".noUi-value").forEach(pip => {
          pip.style.cursor = "pointer";
          pip.addEventListener("click", this.clickOnPip);
        });
    }
  }

  shouldComponentUpdate(nextProps) {
    const { start, disabled, range } = this.props;
    return (
      !isEqual(nextProps.start, start) ||
      nextProps.disabled !== disabled ||
      !isEqual(nextProps.range, range)
    );
  }

  componentDidUpdate() {
    const { start, disabled, range } = this.props;
    this.updateRange(range);
    this.slider.set(start);
    this.toggleDisable(disabled);
  }

  componentWillUnmount() {
    if (this.slider) this.slider.destroy();
    if (this.sliderContainer.current) {
      const value = this.sliderContainer.current.querySelector(".noUi-value");
      if (value) {
        value.removeEventListener("click", this.clickOnPip);
      }
    }
  }

  clickOnPip = pip => {
    const value = Number(pip.target.getAttribute("data-value"));
    this.slider.set(value);
  };

  toggleDisable = disabled => {
    const sliderHTML = this.sliderContainer.current;
    if (sliderHTML) {
      if (!disabled) {
        sliderHTML.removeAttribute("disabled");
      } else {
        sliderHTML.setAttribute("disabled", true);
      }
    }
  };

  updateRange = range => {
    const sliderHTML = this.sliderContainer.current;
    sliderHTML.noUiSlider.updateOptions({ range });
  };

  createSlider() {
    const { onUpdate, onChange, onSlide, onStart, onEnd, onSet } = this.props;
    const slider = nouislider.create(this.sliderContainer.current, {
      ...this.props
    });

    this.slider = slider;

    if (onStart) {
      slider.on("start", onStart);
    }

    if (onSlide) {
      slider.on("slide", onSlide);
    }

    if (onUpdate) {
      slider.on("update", onUpdate);
    }

    if (onChange) {
      slider.on("change", onChange);
    }

    if (onSet) {
      slider.on("set", onSet);
    }

    if (onEnd) {
      slider.on("end", onEnd);
    }
  }

  render() {
    const { id, className, style } = this.props;
    const options = {};
    if (id) {
      options.id = id;
    }
    if (className) {
      options.className = className;
    }
    return <div {...options} ref={this.sliderContainer} style={style} />;
  }
}

Nouislider.propTypes = {
  // https://refreshless.com/nouislider/slider-options/#section-animate
  animate: PropTypes.bool,
  // https://refreshless.com/nouislider/behaviour-option/
  behaviour: PropTypes.string,
  className: PropTypes.string,
  clickablePips: PropTypes.bool,
  // https://refreshless.com/nouislider/slider-options/#section-connect
  connect: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.bool),
    PropTypes.bool
  ]),
  // http://refreshless.com/nouislider/slider-options/#section-orientation
  direction: PropTypes.oneOf(["ltr", "rtl"]),
  // https://refreshless.com/nouislider/more/#section-disable
  disabled: PropTypes.bool,
  keyboardSupport: PropTypes.bool,
  id: PropTypes.string,
  // https://refreshless.com/nouislider/slider-options/#section-limit
  limit: PropTypes.number,
  // https://refreshless.com/nouislider/slider-options/#section-margin
  margin: PropTypes.number,
  // https://refreshless.com/nouislider/events-callbacks/#section-change
  onChange: PropTypes.func,
  // https://refreshless.com/nouislider/events-callbacks/
  onEnd: PropTypes.func,
  // https://refreshless.com/nouislider/events-callbacks/#section-set
  onSet: PropTypes.func,
  // http://refreshless.com/nouislider/events-callbacks/#section-slide
  onSlide: PropTypes.func,
  // http://refreshless.com/nouislider/events-callbacks/
  onStart: PropTypes.func,
  // http://refreshless.com/nouislider/events-callbacks/#section-update
  onUpdate: PropTypes.func,
  // https://refreshless.com/nouislider/slider-options/#section-orientation
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  // https://refreshless.com/nouislider/slider-options/#section-padding
  padding: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.arrayOf(PropTypes.number)
  ]),
  // https://refreshless.com/nouislider/pips/
  pips: PropTypes.object,
  // https://refreshless.com/nouislider/slider-values/#section-range
  range: PropTypes.object.isRequired,
  snap: PropTypes.bool,
  // https://refreshless.com/nouislider/slider-options/#section-start
  start: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string]))
  ]).isRequired,
  // https://refreshless.com/nouislider/slider-options/#section-step
  step: PropTypes.number,
  style: PropTypes.object,
  // https://refreshless.com/nouislider/slider-options/#section-tooltips
  tooltips: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(
      PropTypes.shape({
        to: PropTypes.func
      })
    )
  ])
};

Nouislider.defaultProps = {
  animate: true,
  behaviour: "tap",
  className: null,
  clickablePips: false,
  connect: false,
  direction: "ltr",
  disabled: false,
  margin: null,
  limit: null,
  keyboardSupport: true,
  id: null,
  padding: 0,
  pips: null,
  snap: false,
  step: null,
  style: null,
  orientation: "horizontal",
  tooltips: false,
  onChange: () => {},
  onEnd: () => {},
  onSet: () => {},
  onSlide: () => {},
  onStart: () => {},
  onUpdate: () => {}
};

export default Nouislider;
