import {
  createEvent,
  deleteEvent,
  getEvent,
} from "@redux/slices/admin/eventSlice";
import { Button, Input, Space } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {}

export default function index({}: Props): ReactElement {
  const dispatch = useDispatch();
  const eventData = useSelector((state) => state.event.eventData) as any;
  const [inputContent, setInputContent] = useState<string>();
  const [inputUrl, setInputUrl] = useState<string>();

  useEffect(() => {
    dispatch(getEvent());
  }, []);

  useEffect(() => {
    setInputContent(eventData?.content);
    setInputUrl(eventData?.link);
  }, [eventData]);

  const handleCreateEvent = async () => {
    const data = {
      content: inputContent,
      link: inputUrl,
    };
    console.log(data);
    await dispatch(createEvent(data));
    await dispatch(getEvent());
  };
  return (
    <div className="w-100">
      <Space direction="vertical" className="w-100" size="middle">
        <Input
          addonBefore="Event content:"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
        />
        <Input
          addonBefore="Event URL:"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
        />
        <div className="d-flex align-items-center justify-content-end">
          <Button
            danger
            className="mr-2"
            onClick={async () => {
              await dispatch(deleteEvent());
              await dispatch(getEvent());
            }}
          >
            Delete Event
          </Button>
          <Button type="primary" onClick={() => handleCreateEvent()}>
            Update Event
          </Button>
        </div>
      </Space>
    </div>
  );
}
