import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageTemplate from '../Common/PageTemplate';
import { Container, Box, Typography } from '@mui/material';
import { IEvent, IEventValues } from '@/types/events';
import { getEventById, editEvent } from '@/api';
import EventForm from '../EventForm/EventForm';
import ModalBase from '../Common/ModalBase';
// import Loader from '../Common/Loader';

const EditEvent = () => {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<IEvent | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();

  const onOpenModal = () => setOpenModal(true);

  const onCloseModal = () => {
    setOpenModal(false);
    navigate('/events');
  };

  useEffect(() => {
    setLoading(true);
    const getEvent = async () => {
      if (slug) {
        const event = await getEventById(slug);
        if (event) {
          setEvent(event);
          setLoading(false);
        }
      }
    };

    getEvent();
  }, [slug]);

  const unPublishEvent = async (data: IEventValues) => {
    if (event) {
      await editEvent(data, event.id);
      onOpenModal();
    }
  };

  return (
    <PageTemplate title="Редагувати подію">
      {loading ? (
        // <Loader visible={loading} />
        <div>Loading...</div>
      ) : (
        <Container
          sx={{
            pt: { xs: 4, md: 4, lg: 5 },
            pb: { xs: '60px', md: 10, lg: 15 },
          }}
        >
          {event && (
            <EventForm
              defaultValues={event}
              onPublish={unPublishEvent}
              type="edit"
            />
          )}
        </Container>
      )}

      <ModalBase open={openModal} onClose={onCloseModal}>
        <Box sx={{ padding: '0 24px 56px 24px', textAlign: 'center' }}>
          <Typography>Зміни збережено.</Typography>
        </Box>
      </ModalBase>
    </PageTemplate>
  );
};

export default EditEvent;
