import { render } from 'vitest-browser-react';
import { describe, bench } from 'vitest';
import {Button} from '@gentleduck/registry-ui-duckui/button';
import {Button as SButton} from '@/components/ui/button';

describe('rendering performance', () => {
  bench('duck button', () => {
    render(<Button />);
  });
  bench('shadcn button', () => {
    render(<SButton />);
  });
});

