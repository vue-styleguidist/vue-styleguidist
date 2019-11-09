module.exports = {
    StyleGuide: {
        logo: {
            padding: 24,
            color: '#e9f3fd'
        }
    },
    Version:{
        version: {
            color: '#258aef',
            margin: [[8, 0, 0]],
            padding: [[4, 8, 5]],
            display:'inline-block',
            fontWeight: 400,
            lineHeight: 1,
            border: [[1, 'solid', '#258aef']],
            textTransform: "uppercase",
            fontSize: '11px',
            letterSpacing: "1px",
            borderRadius: 3
        }
    },
    Logo: {
        logo: {
            color: '#e9f3fd',
            fontWeight: 400,
        },
    },
    Link:{
        link: {
            '&, &:link, &:visited': {
                fontWeight: 600,
                color: '#258aef'
            }
        }
    },
    TableOfContents:{
        input: {
            padding: '8px 16px 9px',
            color: 'white',
            border: '1px solid transparent',
            background: '#07294c',
        }
    },
    Playground:{
        preview:{
            padding: '40px',
            backgroundColor: '#f9fafb',
            border: '1px solid #e2e6ea',
            boxShadow: 'inset 0 0 8px rgba(0, 17, 35, 0.05)',
            margin: '16px 0 0',
            borderRadius: '0',
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3
        }
    },
    SectionHeading:{
        sectionName:{
            lineHeight: '1.3',
            width: 'calc(100% + 128px)',
            fontSize: '48px',
            "&:hover": {
                textDecoration: 'none',
                fontSize: '48px',
                lineHeight: '1.3',
            }
        }
    },
    Editor:{
        root:{
            borderTopLeftRadius:0,
            borderTopRightRadius:0, 
        }
    },
    Table: {
        cellHeading:{
            color: '#1a3c5f',
            padding: "16px 48px 16px 16px"
        },
        tableHead: {
            borderBottom: "1px solid #e2e6ea"
        },
        cell:{
            padding: "16px 48px 16px 16px"
        },
        table:{
            "& tr:hover":{
                backgroundColor: 'rgba(233, 243, 253, 0.3)'
            }
        }
    }
}