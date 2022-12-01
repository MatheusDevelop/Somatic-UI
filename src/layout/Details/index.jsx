import {
  ArrowBack,
  Delete,
  DeleteOutlined,
  EditOutlined,
  Help,
  HelpOutlined,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useNavigate } from "react-router-dom";
import screenfull from "screenfull";
import useUserStore from "../../store/userStore";
export const ImageButton = styled(Button)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(0.4),
  height: "100%",
  [theme.breakpoints.down("sm")]: {
    width: "100% !important", // Overrides inline-style
    height: 100,
  },
  "&:hover, &.Mui-focusVisible": {
    zIndex: 1,
    "& .MuiImageBackdrop-root": {
      opacity: 0.15,
    },
    "& .MuiImageMarked-root": {
      opacity: 0,
    },
    "& .MuiTypography-root": {
      border: "4px solid currentColor",
    },
  },
}));
const Details = ({ loading, handleDeleteButtonClick, workout }) => {
  const navigate = useNavigate();
  const userRole = useUserStore((s) => s.role);
  const [currentSequenceSelected, setCurrentSequenceSelected] = useState(null);
  useEffect(() => {
    if (workout.sequences.length > 0)
      setCurrentSequenceSelected(workout.sequences[0]);
  }, [workout]);

  return (
    <Stack container sx={{ flex: 1 }}>
      <Stack
        item
        sx={{
          width: "100%",
          px: {
            lg: 0,
            sm: 2,
            xs: 2,
          },
        }}
      >
        <Grid container alignItems="center">
          <Grid item>
            <IconButton onClick={() => navigate("/workouts")}>
              <ArrowBack />
            </IconButton>
          </Grid>
          <Grid
            item
            xs
            sx={{
              ml: {
                lg: 4,
                sm: 2,
                xs: 2,
              },
            }}
          >
            <Grid container alignItems="center">
              <Grid item xs container alignItems="center">
                <Typography
                  variant={userRole === "Teacher" ? "h6" : "subtitle2"}
                  sx={{ mr: 4 }}
                >
                  {loading ? (
                    <Skeleton
                      variant="text"
                      animation="wave"
                      sx={{ width: 150 }}
                    />
                  ) : (
                    workout.name
                  )}
                </Typography>
                {workout.description && workout.description.length > 0 && (
                  <Tooltip title={workout.description}>
                    <Badge
                      color="error"
                      badgeContent={workout.description}
                      variant="dot"
                    >
                      <InfoOutlined sx={{ fontSize: 18 }} />
                    </Badge>
                  </Tooltip>
                )}
              </Grid>
              {!loading &&
                workout &&
                workout.leaners &&
                userRole === "Teacher" && (
                  <Grid item sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ mr: 2, opacity: 0.6 }}
                    >
                      {workout.leaners.length}{" "}
                      {workout.leaners.length > 1 ? "alunos" : "aluno"}
                    </Typography>
                    <AvatarGroup
                      max={4}
                      sx={{
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          fontSize: 16,
                        },
                      }}
                    >
                      {workout.leaners.map((leaner) => (
                        <Avatar alt={leaner.name}>{leaner.name[0]}</Avatar>
                      ))}
                    </AvatarGroup>
                    <Divider
                      orientation="vertical"
                      variant="middle"
                      flexItem
                      sx={{ mx: 2 }}
                    />
                  </Grid>
                )}

              {workout.assignedUserName && (
                <Grid
                  item
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mr: 2,
                      fontSize: {
                        xs: 8,
                        sm: 8,
                        lg: 12,
                      },
                    }}
                  >
                    <span>Criado por</span> {workout.assignedUserName}
                  </Typography>
                  <Avatar
                    alt={workout.assignedUserName}
                    src={workout.assignedUserProfilePictureUrl}
                    sx={{ width: 32, height: 32 }}
                  >
                    {workout.assignedUserName[0]}
                  </Avatar>
                </Grid>
              )}
              {userRole === "Teacher" && (
                <>
                  <Divider
                    orientation="vertical"
                    variant="middle"
                    flexItem
                    sx={{ mx: 2 }}
                  />
                  <Grid item sx={{ mr: 1 }}>
                    <IconButton
                      color="primary"
                      disabled={loading}
                      onClick={handleDeleteButtonClick}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  </Grid>
                  <Grid item>
                    <IconButton
                      color="primary"
                      disabled={loading}
                      onClick={() => navigate(`/workouts/update/${workout.id}`)}
                    >
                      <EditOutlined />
                    </IconButton>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Stack>
      <Divider
        sx={{
          my: {
            lg: 2,
            sm: 1,
            xs: 1,
          },
        }}
      />
      <Stack
        item
        sx={{
          mb: 1,
          mx: {
            lg: 0,
            sm: 2,
            xs: 2,
          },
        }}
      >
        <Typography variant="h7">
          {!currentSequenceSelected ? (
            <Skeleton variant="text" animation="wave" sx={{ width: 150 }} />
          ) : (
            currentSequenceSelected.name
          )}
        </Typography>
      </Stack>
      <Stack
        item
        sx={{
          mx: {
            lg: 0,
            sm: 2,
            xs: 2,
          },
        }}
      >
        <Grid
          container
          flexWrap="nowrap"
          sx={{
            overflowX: "overlay",
            maxWidth: {
              lg: "91.5vw",
              xs: "91.5vw",
              sm: "91.5vw",
            },
            pb: 2,
          }}
        >
          <Grid item>
            <Paper sx={{ width: 300, height: 150, mr: 2 }}>
              {loading ? (
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  sx={{ width: "100%", height: "100%", borderRadius: 1, mr: 2 }}
                />
              ) : (
                <Stack container spacing={0.5} sx={{ p: 2 }}>
                  <Stack item>
                    <Grid container alignItems="center">
                      <Grid item xs sx={{ opacity: 0.6 }}>
                        <Typography variant="overline">
                          Aparelho / Máq.
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2">
                          {!currentSequenceSelected ? (
                            <Skeleton
                              variant="text"
                              animation="wave"
                              sx={{ width: 100 }}
                            />
                          ) : (
                            `${currentSequenceSelected.machineName} ${
                              currentSequenceSelected.machineNumber
                                ? `- Nº ${currentSequenceSelected.machineNumber}`
                                : ""
                            }`
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Divider />
                  <Stack item>
                    <Grid container alignItems="center">
                      <Grid item xs={2} sx={{ opacity: 0.6 }}>
                        <Typography variant="overline">SÉRIES</Typography>
                      </Grid>
                      <Grid item xs container justifyContent="flex-end">
                        {!currentSequenceSelected ? (
                          <Skeleton
                            variant="text"
                            animation="wave"
                            sx={{ width: 50 }}
                          />
                        ) : (
                          <>
                            {currentSequenceSelected.untilFail && (
                              <Typography variant="subtitle2">
                                Até a falha
                              </Typography>
                            )}
                          </>
                        )}
                        <Divider
                          orientation="vertical"
                          variant="middle"
                          flexItem
                          sx={{ mx: 2 }}
                        />
                        <Typography variant="subtitle2">
                          {!currentSequenceSelected ? (
                            <Skeleton
                              variant="text"
                              animation="wave"
                              sx={{ width: 50 }}
                            />
                          ) : (
                            `${currentSequenceSelected.series} de ${currentSequenceSelected.repetitions}`
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Divider />
                </Stack>
              )}
            </Paper>
          </Grid>
          {currentSequenceSelected &&
            !loading &&
            currentSequenceSelected.mediaUrls.map((url, idx) => (
              <Grid item key={idx}>
                <Paper
                  sx={{
                    width: 200,
                    height: 150,
                    mr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  elevation={3}
                >
                  <ImageButton
                    color="inherit"
                    onClick={() => {
                      const element = document.getElementById(url);
                      if (element) screenfull.request(element);
                    }}
                  >
                    {isImage(url) ? (
                      <img
                        id={url}
                        src={url}
                        alt="Exercise"
                        style={{
                          width: 200,
                          height: "100%",
                          borderRadius: 2,
                        }}
                      />
                    ) : (
                      <ReactPlayer
                        onBuffer={() => console.log("Crrg")}
                        onBufferEnd={() => console.log("endCrrg")}
                        width={"100%"}
                        height="100%"
                        url={url}
                      />
                    )}
                  </ImageButton>
                </Paper>
              </Grid>
            ))}
        </Grid>
      </Stack>
      <Stack
        item
        sx={{
          flex: 1,
          mt: 1,
          p: 2,
          mx: {
            lg: 0,
            sm: 2,
            xs: 2,
          },
          mb: {
            lg: 0,
            sm: 2,
            xs: 2,
          },
        }}
        component={Paper}
      >
        <Typography variant="subtitle2" sx={{ opacity: 0.6 }}>
          Exercícios
        </Typography>
        <Divider sx={{ my: 1 }} />
        {loading || !currentSequenceSelected ? (
          <Skeleton
            animation="wave"
            sx={{
              width: "100%",
              height: "100px",
              mt: 1,
              transformOrigin: "0% 0%",
            }}
          />
        ) : (
          <List
            sx={{
              width: "100%",
              flex: "1 1 0",
              height: "100%",
              overflowY: "overlay",
            }}
          >
            {currentSequenceSelected &&
              workout.sequences.map((sequence, idx) => {
                const labelId = `wkd-label-${sequence.id}`;
                return (
                  <ListItem
                    key={sequence.id}
                    selected={currentSequenceSelected.id === sequence.id}
                    disablePadding
                    sx={{
                      mb: 2,
                    }}
                  >
                    {userRole === "Leaner" && (
                      <ListItemIcon sx={{ padding: 0, minWidth: 0 }}>
                        <Checkbox size="small" />
                      </ListItemIcon>
                    )}
                    <ListItemButton
                      role={undefined}
                      disableGutters
                      sx={{ ml: 0, px: 1 }}
                      onClick={() => setCurrentSequenceSelected(sequence)}
                    >
                      <ListItemText
                        id={labelId}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: {
                              sm: 8,
                              xs: 8,
                              lg: 14,
                            },
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            fontSize: {
                              sm: 8,
                              xs: 8,
                              lg: 14,
                            },
                          },
                        }}
                        primary={sequence.name}
                        secondary={`${sequence.machineName} ${
                          sequence.machineNumber
                            ? `- Nº ${sequence.machineNumber}`
                            : ""
                        }`}
                      />
                      {sequence.untilFail && (
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: {
                              sm: 6,
                              xs: 6,
                              lg: 12,
                            },
                          }}
                        >
                          Até a falha
                        </Typography>
                      )}
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{
                          mx: {
                            lg: 4,
                            xs: 2,
                            sm: 2,
                          },
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: 40,
                          justifyContent: "flex-end",
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: {
                              sm: 8,
                              xs: 8,
                              lg: 12,
                            },
                          }}
                        >
                          {sequence.series}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            mx: 1,
                            fontSize: {
                              sm: 8,
                              xs: 8,
                              lg: 12,
                            },
                          }}
                        >
                          de
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            fontSize: {
                              sm: 8,
                              xs: 8,
                              lg: 12,
                            },
                          }}
                        >
                          {sequence.repetitions}
                        </Typography>
                      </div>
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
        )}
      </Stack>
    </Stack>
  );
};

export default Details;
export function isImage(url) {
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}
