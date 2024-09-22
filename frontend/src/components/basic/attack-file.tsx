import React, { FC, useRef} from "react";
import { Space, Avatar, Button, Typography } from 'antd';
import { DeleteOutlined as RemoveCircleIcon, PlusOutlined } from '@ant-design/icons';
import _ from "lodash";

const { Text } = Typography;

const { REACT_APP_HOST_GRAPHAL } = process.env;

interface AttackFileFieldProps {
  label: string;
  values: any; // Assuming values is an array of File objects
  multiple?: boolean;
  required?: boolean;
  onChange: (newValues: File[]) => void;
  onSnackbar: (snackbar: { open: boolean; message: string }) => void;
}

const AttackFileField: FC<AttackFileFieldProps> = ({
  label,
  values,
  multiple = false,
  required = false,
  onChange,
  onSnackbar
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return; 
    let newInputList = [...values];
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      if (file.type) {
        newInputList = [...newInputList, file];
      }
    }
    onChange(newInputList);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Space>
      <Text>{label}</Text>
      <label htmlFor="contained-button-file">
        <input
          type="file"
          id="contained-button-file"
          ref={inputRef} 
          style={{ display: 'none' }}
          multiple={multiple}
          accept="image/*"
          onChange={onFileChange}
        />
        <Button
          icon={<PlusOutlined />}
          shape="circle"
          onClick={handleClick}
        />
      </label>
      <Space direction="horizontal" size={2}>
        {_.map( _.filter(values, (v) => !v?.delete), (file, index) => {
            const isOldFile = file?.url;
            return (
              <Space style={{ position: "relative" }} key={index}>
                <Avatar 
                  style={{ 
                    height: 150,
                    width: 150,
                    border: "1px solid #cccccc",
                    padding: "5px",
                    marginBottom: "5px"
                  }} 
                  shape={"square"} 
                  src={isOldFile ? `http://${REACT_APP_HOST_GRAPHAL}/${file?.url}` : URL.createObjectURL(file)} 
                />
                <Button
                  icon={<RemoveCircleIcon />} 
                  type="link"
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 20,
                    zIndex: 1,  // Ensure the button stays on top of the avatar
                    height: "15px", // Set the button height
                    width: "15px",  // Set the button width
                  }}
                  onClick={() => {
                    const newInputList = [...values];
                    const i = _.findIndex(newInputList, (v) => v._id === file._id);
                    if (isOldFile) {
                      if (i !== -1) {
                        newInputList[i] = {
                          ...newInputList[i],
                          delete: true,
                        };
                      }
                    } else {
                      newInputList.splice(index, 1);
                    }
                    onChange(newInputList);
                    onSnackbar({ open: true, message: "Delete image" });
                  }}
                />
              </Space>
            );
          }
        )}
      </Space>
    </Space>
  );
};

export default AttackFileField;
