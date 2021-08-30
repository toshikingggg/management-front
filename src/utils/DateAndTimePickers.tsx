import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Button from '../utils/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (v, k) => k + start);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginBottom: theme.spacing(3),
    },
    textField: {
      width: 200,
      marginBottom: theme.spacing(2),
    },
    box: {
      width: 100,
      marginBottom: theme.spacing(2),
    },
    autoComplete: {
      marginBottom: theme.spacing(3),
    },
  }),
);

type Props = {
  startLabel: string;
  endLabel: string;
  date: string;
  users: any[];
};

type Option = {
  id: number;
  name: string;
  kana: string;
};

const DateAndTimePickers: React.FC<Props> = ({ startLabel, endLabel, date, users }) => {
  const classes = useStyles();

  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [values, setValues] = useState<number[]>([]);

  const registerDate = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      //TODO orgIdは団体選択画面から遷移するときにcontextで持っておくと良さそう
      const orgId = 43; //need to change
      const spaceId = 4; //need to change
      await fetch(
        `${process.env.NEXT_PUBLIC_API_ROOT}/api/organization/${orgId}/space/${spaceId}/reservation`,
        {
          method: 'POST',
          body: JSON.stringify({
            numbers: number,
            start_time: startTime,
            end_time: endTime,
            users: values, //need to change
          }),
          // mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${sessionStorage.getItem('access_token')}`,
          },
        },
      ).then((res) => {
        if (res.status === 401) {
          throw 'authentication failed';
        } else if (res.ok) {
          alert('予約しました');
        } else {
          throw '予期せぬエラーが発生しました';
        }
      });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <form className={classes.container} noValidate onSubmit={registerDate}>
      {/* <form className={classes.container} noValidate> */}
      <TextField
        id="datetime-local"
        label={startLabel}
        type="datetime-local"
        // defaultValue="2017-05-24T10:30"
        defaultValue={date}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          setStartTime(e.target.value);
        }}
      />
      <br />
      <TextField
        id="datetime-local"
        label={endLabel}
        type="datetime-local"
        // defaultValue="2017-05-24T10:30"
        defaultValue={date}
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={(e) => {
          setEndTime(e.target.value);
        }}
      />

      <Box className={classes.box}>
        <FormControl fullWidth>
          <InputLabel variant="standard" htmlFor="uncontrolled-native">
            人数
          </InputLabel>
          <NativeSelect
            defaultValue={30}
            inputProps={{
              name: 'number',
              id: 'uncontrolled-native',
            }}
            onChange={(e) => {
              setNumber(e.target.value);
            }}
          >
            {range(1, 8).map((i) => {
              return (
                <option key={i} value={i}>
                  {i}
                </option>
              );
            })}
          </NativeSelect>
        </FormControl>
      </Box>
      <Autocomplete
        className={classes.autoComplete}
        multiple
        id="tags-standard"
        // options={top100Films}
        options={users}
        getOptionLabel={(option: Option) => option.name}
        // getOptionLabel={(option) => option.title}
        renderInput={(params) => (
          <TextField {...params} variant="standard" label="一緒に予約する人を選択" />
        )}
        onChange={(_, v) => {
          const ids: number[] = [];
          v.map(({ id }) => ids.push(id));
          setValues(ids);
        }}
      />
      <Button>予定を追加する</Button>
    </form>
  );
};

export default DateAndTimePickers;
