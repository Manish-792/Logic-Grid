import { Box, Tabs, Tab, Button, Stack, Typography, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import Editor from '@monaco-editor/react';

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
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default
}));

const LanguageSelector = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

const ActionButtons = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between'
}));

const getLanguageForMonaco = (lang) => {
  switch (lang) {
    case 'javascript': return 'javascript';
    case 'java': return 'java';
    case 'cpp': return 'cpp';
    default: return 'javascript';
  }
};

const RightPanel = ({
  activeRightTab,
  setActiveRightTab,
  selectedLanguage,
  handleLanguageChange,
  code,
  handleEditorChange,
  handleEditorDidMount,
  handleRun,
  handleSubmitCode,
  loading,
  runResult,
  submitResult
}) => {
  const handleTabChange = (event, newValue) => {
    setActiveRightTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <StyledTabs value={activeRightTab} onChange={handleTabChange}>
        <Tab label="Code" value="code" />
        <Tab label="Testcase" value="testcase" />
        <Tab label="Result" value="result" />
      </StyledTabs>

      <ContentContainer>
        {activeRightTab === 'code' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <LanguageSelector>
              <Stack direction="row" spacing={1}>
                {['javascript', 'java', 'cpp'].map((lang) => (
                  <Button
                    key={lang}
                    variant={selectedLanguage === lang ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => handleLanguageChange(lang)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                  </Button>
                ))}
              </Stack>
            </LanguageSelector>

            <Box sx={{ flex: 1 }}>
              <Editor
                height="100%"
                language={getLanguageForMonaco(selectedLanguage)}
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  wordWrap: 'on',
                  lineNumbers: 'on',
                  glyphMargin: false,
                  folding: true,
                  lineDecorationsWidth: 10,
                  lineNumbersMinChars: 3,
                  renderLineHighlight: 'line',
                  selectOnLineNumbers: true,
                  roundedSelection: false,
                  readOnly: false,
                  cursorStyle: 'line',
                  mouseWheelZoom: true,
                }}
              />
            </Box>

            <ActionButtons>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setActiveRightTab('testcase')}
                sx={{ textTransform: 'none' }}
              >
                Console
              </Button>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleRun}
                  disabled={loading}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'secondary.main',
                    '&:hover': {
                      backgroundColor: 'secondary.dark'
                    }
                  }}
                >
                  {loading ? 'Running...' : 'Run'}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSubmitCode}
                  disabled={loading}
                  sx={{ textTransform: 'none' }}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </Stack>
            </ActionButtons>
          </Box>
        )}

        {activeRightTab === 'testcase' && (
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Test Results
            </Typography>
            {runResult ? (
              <Alert
                severity={runResult.success ? 'success' : 'error'}
                sx={{ mb: 2 }}
              >
                <Box>
                  {runResult.success ? (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        ✅ All test cases passed!
                      </Typography>
                      <Typography variant="body2">Runtime: {runResult.runtime} sec</Typography>
                      <Typography variant="body2">Memory: {runResult.memory} KB</Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        {runResult.testCases.map((tc, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 1.5,
                              mb: 1,
                              backgroundColor: 'background.default',
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontFamily: 'monospace'
                            }}
                          >
                            <div><strong>Input:</strong> {tc.stdin}</div>
                            <div><strong>Expected:</strong> {tc.expected_output}</div>
                            <div><strong>Output:</strong> {tc.stdout}</div>
                            <div style={{ color: '#00CED1' }}>✓ Passed</div>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        ❌ Error
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {runResult.testCases.map((tc, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 1.5,
                              mb: 1,
                              backgroundColor: 'background.default',
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontFamily: 'monospace'
                            }}
                          >
                            <div><strong>Input:</strong> {tc.stdin}</div>
                            <div><strong>Expected:</strong> {tc.expected_output}</div>
                            <div><strong>Output:</strong> {tc.stdout}</div>
                            <div style={{ color: tc.status_id === 3 ? '#00CED1' : '#8b861d' }}>
                              {tc.status_id === 3 ? '✓ Passed' : '✗ Failed'}
                            </div>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Alert>
            ) : (
              <Typography sx={{ color: 'text.primary' }}>
                Click "Run" to test your code with the example test cases.
              </Typography>
            )}
          </Box>
        )}

        {activeRightTab === 'result' && (
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Submission Result
            </Typography>
            {submitResult ? (
              <Alert severity={submitResult.accepted ? 'success' : 'error'}>
                <Box>
                  {submitResult.accepted ? (
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        🎉 Accepted
                      </Typography>
                      <Typography variant="body2">
                        Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}
                      </Typography>
                      <Typography variant="body2">Runtime: {submitResult.runtime} sec</Typography>
                      <Typography variant="body2">Memory: {submitResult.memory}KB</Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h5" sx={{ mb: 2 }}>
                        ❌ {submitResult.error}
                      </Typography>
                      <Typography variant="body2">
                        Test Cases Passed: {submitResult.passedTestCases}/{submitResult.totalTestCases}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Alert>
            ) : (
              <Typography sx={{ color: 'text.primary' }}>
                Click "Submit" to submit your solution for evaluation.
              </Typography>
            )}
          </Box>
        )}
      </ContentContainer>
    </Box>
  );
};

export default RightPanel;