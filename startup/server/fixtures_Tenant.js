/* eslint-disable no-underscore-dangle */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { Roles } from 'meteor/alanning:roles';

import Tenant from '../../apps/common/entities/Tenant/api';
import Org from '../../apps/common/entities/Org/api';

import parseDotToUnderscore from '../../apps/common/helpers/parseDotToUnderscore';
import entityUpdate from '../../apps/common/helpers/server/entityUpdate';

const tenantExist = Tenant.findOne();
if (Meteor.isDevelopment && !tenantExist) {
  console.info('[ FIXTURE START ] Tenant', new Date());

  const tenants = [
    {
      _id: Random.id(),
      name: 'Common Application',
      host: 'common.maya',
      email: 'no-reply@common.maya',
      logoUrl:
        'https://s3-ap-southeast-1.amazonaws.com/gudang.maya.network/mkcb/img/mkcb_logo_small.png',
      roleStandard: 'user',
      roles: ['user', 'member', 'spv', 'admin'],
      rolesUserInOrg: ['member', 'admin'],
      rolesOrgInTenant: ['member', 'owner'],
      type: 'Host',
      status: 'Active',
      settings: {
        productname: 'COMMON',
        version: '0.0.1',
        fullname: 'Common Application',
        shortname: 'common',
        logo: '/mkcb_logo.png',
        description: 'Catalyst for your common Application',
        perPage: 12,
        minCharSearch: 3,
        locale: 'id',
        timezone: 'Asia/Jakarta',
        currency: 'IDR',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        orgTypes: ['Company', 'Division', 'Department', 'Other'],
      },
    },
    {
      _id: Random.id(),
      name: 'Example Application',
      host: 'example.maya',
      email: 'no-reply@example.maya',
      logoUrl:
        'https://s3-ap-southeast-1.amazonaws.com/gudang.maya.network/mkcb/img/mkcb_logo_small.png',
      roleStandard: 'user',
      roles: ['user', 'member', 'spv', 'admin'],
      rolesUserInOrg: ['member', 'admin'],
      rolesOrgInTenant: ['member', 'owner'],
      type: 'Host',
      status: 'Active',
      settings: {
        productname: 'EXAMPLE',
        version: '20.05.25',
        fullname: 'EXAMPLE Application',
        shortname: 'example',
        logo: '/mkcb_logo.png',
        description: 'Example Application as Catalyst for new Development',
        perPage: 12,
        minCharSearch: 3,
        locale: 'id',
        timezone: 'Asia/Jakarta',
        currency: 'IDR',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        orgTypes: ['Company', 'PersonalMerchant', 'Other'],
      },
    },
    {
      _id: Random.id(),
      name: 'Localhost Application',
      host: 'localhost',
      email: 'no-reply@example.maya',
      logoUrl:
        'https://s3-ap-southeast-1.amazonaws.com/gudang.maya.network/mkcb/img/mkcb_logo_small.png',
      roleStandard: 'user',
      roles: ['user', 'member', 'spv', 'admin'],
      rolesUserInOrg: ['member', 'admin'],
      rolesOrgInTenant: ['member', 'owner'],
      type: 'Host',
      status: 'Active',
      settings: {
        productname: 'LOCALHOST',
        version: '20.05.25',
        fullname: 'LOCALHOST Application',
        shortname: 'localhost',
        logo: '/mkcb_logo.png',
        description: 'Localhost as Example Application as Catalyst for new Development',
        perPage: 12,
        minCharSearch: 3,
        locale: 'id',
        timezone: 'Asia/Jakarta',
        currency: 'IDR',
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
        orgTypes: ['Company', 'Division', 'Department', 'Other'],
      },
    },
  ];

  // now add org mkcb as owner of all tenants
  const now = new Date();
  const admin = Meteor.users.findOne({ 'emails.address': 'admin@admin.com' });
  const owner = Org.findOne({ shortname: 'MKCB' });

  tenants.forEach((tenant) => {
    Tenant._collection.insert({
      ...tenant,
      owner: {
        _id: owner._id,
        type: 'Org',
        name: owner.name,
      },
      createdAt: now,
      createdBy: admin.profile.fullname,
      updatedAt: now,
      updatedBy: admin.profile.fullname,
    });

    tenant.roles.forEach((role) => {
      Roles.createRole(role, { unlessExists: true });
    });
    tenant.rolesUserInOrg.forEach((role) => {
      Roles.createRole(role, { unlessExists: true });
    });
    tenant.rolesOrgInTenant.forEach((role) => {
      Roles.createRole(role, { unlessExists: true });
    });

    // we use Roles to reflect the org roles in the tenant, e.g. owner, merchant, etc
    Roles.addUsersToRoles(`${owner._id}.org`, 'owner', tenant.host);

    // now we inject the host in org to have same behaviour as user in host
    const hostDotToUnderscore = parseDotToUnderscore(tenant.host);
    const doc = {};
    doc[`hosts.${hostDotToUnderscore}`] = {
      status: 'Active',
      createdAt: new Date(),
      createdBy: admin.profile.fullname,
      updatedAt: new Date(),
      updatedBy: admin.profile.fullname,
    };

    entityUpdate(
      Org,
      { _id: owner._id },
      doc,
      'fixture',
      { _id: admin._id, type: 'Member', name: admin.profile.fullname },
      now,
    );
  });

  console.info(`[ FIXTURE END ] Tenant added ${tenants.length}`, new Date());
}
