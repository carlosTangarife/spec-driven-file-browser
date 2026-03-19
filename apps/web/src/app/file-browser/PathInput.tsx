import {
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  Input,
} from '@chakra-ui/react';
import type { KeyboardEvent } from 'react';
import { PATH_INPUT_MAX_LENGTH } from './path-input.utils';

export type PathInputProps = {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
};

/**
 * Controlled path field with helper copy for the listing API wire format.
 */
export const PathInput = ({ value, onChange, onKeyDown }: PathInputProps) => (
  <FieldRoot>
    <FieldLabel>Path</FieldLabel>
    <Input
      width="100%"
      maxW="100%"
      px={{ base: 3, md: 4 }}
      py={{ base: 2, md: 2 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      maxLength={PATH_INPUT_MAX_LENGTH}
      placeholder="e.g. app or src/components (empty = root)"
      autoComplete="off"
      spellCheck={false}
    />
    <FieldHelperText>
      Use a relative path with forward slashes; the last segment filters names after 3+
      characters. Leave empty for the allowed root (max {PATH_INPUT_MAX_LENGTH}{' '}
      characters).
    </FieldHelperText>
  </FieldRoot>
);
