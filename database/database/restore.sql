--
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE api;
--
-- Name: api; Type: DATABASE; Schema: -; Owner: jeguglie
--

CREATE DATABASE api WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'UTF-8';


ALTER DATABASE api OWNER TO jeguglie;

\connect api

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: interests; Type: TABLE; Schema: public; Owner: jeguglie
--

CREATE TABLE public.interests (
    id integer NOT NULL,
    interest character varying(255) NOT NULL
);


ALTER TABLE public.interests OWNER TO jeguglie;

--
-- Name: interests_id_seq; Type: SEQUENCE; Schema: public; Owner: jeguglie
--

CREATE SEQUENCE public.interests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.interests_id_seq OWNER TO jeguglie;

--
-- Name: interests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jeguglie
--

ALTER SEQUENCE public.interests_id_seq OWNED BY public.interests.id;


--
-- Name: pictures; Type: TABLE; Schema: public; Owner: jv
--

CREATE TABLE public.pictures (
    img_id integer NOT NULL,
    img_link character varying(255),
    user_id integer,
    img_order integer NOT NULL
);


ALTER TABLE public.pictures OWNER TO jv;

--
-- Name: pictures_img_id_seq; Type: SEQUENCE; Schema: public; Owner: jv
--

CREATE SEQUENCE public.pictures_img_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.pictures_img_id_seq OWNER TO jv;

--
-- Name: pictures_img_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv
--

ALTER SEQUENCE public.pictures_img_id_seq OWNED BY public.pictures.img_id;


--
-- Name: profile; Type: TABLE; Schema: public; Owner: jv
--

CREATE TABLE public.profile (
    user_id integer,
    lastname character varying,
    firstname character varying,
    gender character varying,
    interested character varying,
    country character varying,
    bio character varying,
    longitude numeric(255,8),
    latitude numeric(255,8),
    age integer,
    likes integer NOT NULL
);


ALTER TABLE public.profile OWNER TO jv;

--
-- Name: profile_id_seq; Type: SEQUENCE; Schema: public; Owner: jv
--

CREATE SEQUENCE public.profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.profile_id_seq OWNER TO jv;

--
-- Name: profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv
--

ALTER SEQUENCE public.profile_id_seq OWNED BY public.profile.user_id;


--
-- Name: user_complete; Type: TABLE; Schema: public; Owner: jv
--

CREATE TABLE public.user_complete (
    complete_basics integer DEFAULT 0 NOT NULL,
    complete_photos integer DEFAULT 0 NOT NULL,
    complete_interets integer DEFAULT 0 NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.user_complete OWNER TO jv;

--
-- Name: user_interests; Type: TABLE; Schema: public; Owner: jv
--

CREATE TABLE public.user_interests (
    user_id integer NOT NULL,
    interest_id integer NOT NULL
);


ALTER TABLE public.user_interests OWNER TO jv;

--
-- Name: user_interests_user_id_seq; Type: SEQUENCE; Schema: public; Owner: jv
--

CREATE SEQUENCE public.user_interests_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_interests_user_id_seq OWNER TO jv;

--
-- Name: user_interests_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv
--

ALTER SEQUENCE public.user_interests_user_id_seq OWNED BY public.user_interests.user_id;


--
-- Name: user_likes; Type: TABLE; Schema: public; Owner: jeguglie
--

CREATE TABLE public.user_likes (
    user_id_like integer,
    user_id_liked integer
);


ALTER TABLE public.user_likes OWNER TO jeguglie;

--
-- Name: users; Type: TABLE; Schema: public; Owner: jv
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255),
    email character varying(255),
    password character varying(255),
    tokenmail integer DEFAULT 0,
    complete integer DEFAULT 0,
    active integer DEFAULT 0,
    admin integer
);


ALTER TABLE public.users OWNER TO jv;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: jv
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO jv;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jv
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: interests id; Type: DEFAULT; Schema: public; Owner: jeguglie
--

ALTER TABLE ONLY public.interests ALTER COLUMN id SET DEFAULT nextval('public.interests_id_seq'::regclass);


--
-- Name: pictures img_id; Type: DEFAULT; Schema: public; Owner: jv
--

ALTER TABLE ONLY public.pictures ALTER COLUMN img_id SET DEFAULT nextval('public.pictures_img_id_seq'::regclass);


--
-- Name: user_interests user_id; Type: DEFAULT; Schema: public; Owner: jv
--

ALTER TABLE ONLY public.user_interests ALTER COLUMN user_id SET DEFAULT nextval('public.user_interests_user_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: jv
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: interests; Type: TABLE DATA; Schema: public; Owner: jeguglie
--

COPY public.interests (id, interest) FROM stdin;
\.
COPY public.interests (id, interest) FROM '$$PATH$$/3239.dat';

--
-- Data for Name: pictures; Type: TABLE DATA; Schema: public; Owner: jv
--

COPY public.pictures (img_id, img_link, user_id, img_order) FROM stdin;
\.
COPY public.pictures (img_id, img_link, user_id, img_order) FROM '$$PATH$$/3229.dat';

--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: jv
--

COPY public.profile (user_id, lastname, firstname, gender, interested, country, bio, longitude, latitude, age, likes) FROM stdin;
\.
COPY public.profile (user_id, lastname, firstname, gender, interested, country, bio, longitude, latitude, age, likes) FROM '$$PATH$$/3231.dat';

--
-- Data for Name: user_complete; Type: TABLE DATA; Schema: public; Owner: jv
--

COPY public.user_complete (complete_basics, complete_photos, complete_interets, user_id) FROM stdin;
\.
COPY public.user_complete (complete_basics, complete_photos, complete_interets, user_id) FROM '$$PATH$$/3236.dat';

--
-- Data for Name: user_interests; Type: TABLE DATA; Schema: public; Owner: jv
--

COPY public.user_interests (user_id, interest_id) FROM stdin;
\.
COPY public.user_interests (user_id, interest_id) FROM '$$PATH$$/3233.dat';

--
-- Data for Name: user_likes; Type: TABLE DATA; Schema: public; Owner: jeguglie
--

COPY public.user_likes (user_id_like, user_id_liked) FROM stdin;
\.
COPY public.user_likes (user_id_like, user_id_liked) FROM '$$PATH$$/3240.dat';

--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: jv
--

COPY public.users (user_id, username, email, password, tokenmail, complete, active, admin) FROM stdin;
\.
COPY public.users (user_id, username, email, password, tokenmail, complete, active, admin) FROM '$$PATH$$/3234.dat';

--
-- Name: interests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jeguglie
--

SELECT pg_catalog.setval('public.interests_id_seq', 4008, true);


--
-- Name: pictures_img_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv
--

SELECT pg_catalog.setval('public.pictures_img_id_seq', 5000, true);


--
-- Name: profile_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv
--

SELECT pg_catalog.setval('public.profile_id_seq', 3, true);


--
-- Name: user_interests_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv
--

SELECT pg_catalog.setval('public.user_interests_user_id_seq', 2, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: jv
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1004, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: jv
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

