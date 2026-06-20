import { render, screen } from '@testing-library/react';
import EmissionTrend from '@/components/dashboard/EmissionTrend';

// Mock Recharts to avoid issues with measuring DOM elements in JSDOM
jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: React.PropsWithChildren<unknown>) => (
      <div data-testid="responsive-container" style={{ width: '100%', height: '300px' }}>
        {children}
      </div>
    ),
    AreaChart: ({ children }: React.PropsWithChildren<unknown>) => <div data-testid="area-chart">{children}</div>,
    XAxis: () => <div data-testid="x-axis" />,
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Area: () => <div data-testid="area" />,
  };
});

describe('EmissionTrend Component', () => {
  const mockData = [
    { month: 'Jan', emissions: 100 },
    { month: 'Feb', emissions: 120 },
  ];

  it('renders the chart container', () => {
    render(<EmissionTrend monthlyTrend={mockData} />);
    const container = screen.getByTestId('responsive-container');
    expect(container).toBeInTheDocument();
  });

  it('renders the AreaChart component', () => {
    render(<EmissionTrend monthlyTrend={mockData} />);
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
  });

  it('renders the axes and grid', () => {
    render(<EmissionTrend monthlyTrend={mockData} />);
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('cartesian-grid')).toBeInTheDocument();
  });
});
