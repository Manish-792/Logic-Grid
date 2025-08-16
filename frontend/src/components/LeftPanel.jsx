import { Box, Tabs, Tab, Typography, Chip, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import SubmissionHistory from './SubmissionHistory';
import ChatAi from './ChatAi';
import Editorial from './Editorial';

const StyledTabs = styled(Tabs)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTab-root': {
    color: theme.palette.text.primary,
    '&.Mui-selected': {
      color: theme.palette.primary.contrastText,
      backgroundColor: theme.palette.primary.main
    }
  }
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default
}));

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'easy': return '#00CED1';
    case 'medium': return '#FFD700';
    case 'hard': return '#FF4500';
    default: return '#eeeee4';
  }
};

const LeftPanel = ({ problem, activeLeftTab, setActiveLeftTab, problemId }) => {
  const handleTabChange = (event, newValue) => {
    setActiveLeftTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StyledTabs value={activeLeftTab} onChange={handleTabChange} variant="scrollable">
        <Tab label="Description" value="description" />
        <Tab label="Editorial" value="editorial" />
        <Tab label="Solutions" value="solutions" />
        <Tab label="Submissions" value="submissions" />
        <Tab label="ChatAI" value="chatAI" />
      </StyledTabs>

      <ContentContainer>
        {problem && (
          <>
            {activeLeftTab === 'description' && (
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    {problem.title}
                  </Typography>
                  <Chip
                    label={problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                    variant="outlined"
                    sx={{
                      borderColor: getDifficultyColor(problem.difficulty),
                      color: getDifficultyColor(problem.difficulty)
                    }}
                  />
                  <Chip
                    label={problem.tags}
                    sx={{
                      backgroundColor: 'secondary.main',
                      color: 'primary.contrastText'
                    }}
                  />
                </Stack>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    mb: 4
                  }}
                >
                  {problem.description}
                </Typography>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" sx={{ color: 'primary.main', mb: 2 }}>
                    Examples:
                  </Typography>
                  <Stack spacing={2}>
                    {problem.visibleTestCases.map((example, index) => (
                      <Box
                        key={index}
                        sx={{
                          p: 2,
                          backgroundColor: 'background.paper',
                          borderRadius: 1
                        }}
                      >
                        <Typography variant="h6" sx={{ color: 'primary.main', mb: 1 }}>
                          Example {index + 1}:
                        </Typography>
                        <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'text.primary' }}>
                          <Typography component="div"><strong>Input:</strong> {example.input}</Typography>
                          <Typography component="div"><strong>Output:</strong> {example.output}</Typography>
                          <Typography component="div"><strong>Explanation:</strong> {example.explanation}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            )}

            {activeLeftTab === 'editorial' && (
              <Box>
                <Typography variant="h4" sx={{ color: 'primary.main', mb: 2 }}>
                  Editorial
                </Typography>
                <Editorial 
                  secureUrl={problem.secureUrl} 
                  thumbnailUrl={problem.thumbnailUrl} 
                  duration={problem.duration}
                />
              </Box>
            )}

            {activeLeftTab === 'solutions' && (
              <Box>
                <Typography variant="h4" sx={{ color: 'primary.main', mb: 2 }}>
                  Solutions
                </Typography>
                <Stack spacing={3}>
                  {problem.referenceSolution?.map((solution, index) => (
                    <Box
                      key={index}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          backgroundColor: 'background.paper'
                        }}
                      >
                        <Typography variant="h6" sx={{ color: 'primary.main' }}>
                          {problem?.title} - {solution?.language}
                        </Typography>
                      </Box>
                      <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                        <Box
                          component="pre"
                          sx={{
                            p: 2,
                            backgroundColor: 'background.paper',
                            color: 'text.primary',
                            borderRadius: 1,
                            overflow: 'auto',
                            fontSize: '0.875rem',
                            fontFamily: 'monospace'
                          }}
                        >
                          <code>{solution?.completeCode}</code>
                        </Box>
                      </Box>
                    </Box>
                  )) || (
                    <Typography sx={{ color: 'text.primary' }}>
                      Solutions will be available after you solve the problem.
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}

            {activeLeftTab === 'submissions' && (
              <Box>
                <Typography variant="h4" sx={{ color: 'primary.main', mb: 2 }}>
                  My Submissions
                </Typography>
                <SubmissionHistory problemId={problemId} />
              </Box>
            )}

            {activeLeftTab === 'chatAI' && (
              <Box>
                <Typography variant="h4" sx={{ color: 'primary.main', mb: 2 }}>
                  CHAT with AI
                </Typography>
                <ChatAi problem={problem} />
              </Box>
            )}
          </>
        )}
      </ContentContainer>
    </Box>
  );
};

export default LeftPanel;