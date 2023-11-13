CREATE TABLE edt_data (
    edtid int NOT NULL,
    title LONGTEXT NOT NULL,
    author varchar(500),
    year varchar(5),
    university varchar(255),
    program varchar(255),
    degree varchar(255),
    advisor varchar(255),
    abstract LONGTEXT,
    pdf varchar(255),
    wikifier_terms LONGTEXT,
    PRIMARY KEY (edtid)
);