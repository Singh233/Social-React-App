import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Skeleton from '@mui/joy/Skeleton';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';

export default function PostCardSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Card
        variant="outlined"
        sx={{
          width: 350,
          height: 'max-content',
          background: '#121212',
          border: 'none',
          borderRadius: 30,
        }}
      >
        <div>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{ position: 'absolute', top: '0.5rem', left: '0.5rem', m: 1 }}
          >
            <BookmarkAdd />
            <Skeleton style={{ background: '#121212' }} />
          </IconButton>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem', m: 1 }}
          >
            <BookmarkAdd />
            <Skeleton style={{ background: '#121212' }} />
          </IconButton>
          <Typography level="h2" fontSize="md" sx={{ mb: 1, ml: 5, mt: 0.5 }}>
            <Skeleton style={{ background: '#121212' }}>
              Yosemite National Park
            </Skeleton>
          </Typography>
        </div>
        <AspectRatio minHeight="400px" minwidth="400px">
          <Skeleton style={{ background: 'black' }}>
            <img
              src="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286"
              srcSet="https://images.unsplash.com/photo-1527549993586-dff825b37782?auto=format&fit=crop&w=286&dpr=2 2x"
              loading="lazy"
              alt=""
            />
          </Skeleton>
          <Skeleton>Total price:</Skeleton>
        </AspectRatio>
        <CardContent orientation="horizontal">
          <div>
            <Typography level="body-xs">
              <Skeleton style={{ background: '#121212' }}>
                Total price:
              </Skeleton>
            </Typography>
            <Typography fontSize="lg" fontWeight="lg">
              <Skeleton style={{ background: '#121212' }}>$2,900</Skeleton>
            </Typography>
          </div>
          <Button
            variant="solid"
            size="sm"
            color="primary"
            aria-label="Explore Bahamas Islands"
            sx={{ ml: 'auto', fontWeight: 600 }}
          >
            Explore
            <Skeleton style={{ background: '#121212' }} />
          </Button>
        </CardContent>
      </Card>
      <Card
        variant="outlined"
        sx={{
          width: 350,
          height: 'max-content',
          background: '#121212',
          border: 'none',
          borderRadius: 30,
          mt: 2,
        }}
      >
        <div>
          <IconButton
            aria-label="bookmark Bahamas Islands"
            variant="plain"
            color="neutral"
            size="sm"
            sx={{ position: 'absolute', top: '0.5rem', right: '0.5rem', m: 1 }}
          >
            <BookmarkAdd />
            <Skeleton style={{ background: '#121212' }} />
          </IconButton>
          <Typography level="h2" fontSize="md" sx={{ mb: 1, ml: 1, mt: 0.5 }}>
            <Skeleton style={{ background: '#121212' }}>
              Add a comment here testing blah blah
            </Skeleton>
          </Typography>
        </div>
      </Card>
    </div>
  );
}
