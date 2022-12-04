import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, STYLE_TYPE, LABEL_PLACEMENT } from 'baseui/checkbox';
import { toggleSkipBreak, setSkipBreak } from '../skipBreakSlice';

export default function UISwitch({ text, startState }) {
  const skipBreak = useSelector(state => state.skipBreak.value);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSkipBreak(startState));
  }, []);

  return (
    <Checkbox
      checked={skipBreak}
      checkmarkType={STYLE_TYPE.toggle}
      onChange={() => dispatch(toggleSkipBreak())}
      labelPlacement={LABEL_PLACEMENT.left}
    >
      {text}
    </Checkbox>
  );
}
